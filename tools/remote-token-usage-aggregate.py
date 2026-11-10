#!/usr/bin/env python3
"""Aggregate safe daily Token usage snapshots into the public blog data file."""
import json
import os
import sys
from datetime import datetime, timezone

FIELDS = ("inputTokens", "outputTokens", "cacheCreationTokens", "cacheReadTokens")
SOURCE_NAMES = {"codex": "Codex", "claude-code": "Claude Code", "hermes": "Hermes", "deepseek": "DeepSeek"}

def agent_for_model(model):
    name = str(model).lower()
    if name.startswith("gpt-") or "codex" in name:
        return ("codex", "Codex")
    if name.startswith("claude-"):
        return ("claude-code", "Claude Code")
    if name.startswith("deepseek"):
        return ("deepseek", "DeepSeek")
    return ("other", "其他 Agent")

def blank():
    return {key: 0 for key in (*FIELDS, "costUsd")}

def add(target, source):
    for key in (*FIELDS, "costUsd"):
        target[key] += float(source.get(key, 0) or 0)

def token_total(value):
    return int(sum(value.get(key, 0) or 0 for key in FIELDS))

def main(source, output):
    daily = {}
    snapshot_times = []
    for filename in sorted(os.listdir(source)):
        if not filename.endswith('.json'):
            continue
        with open(os.path.join(source, filename), encoding='utf-8') as handle:
            payload = json.load(handle)
        date = payload.get('date')
        usage = payload.get('usage')
        if isinstance(date, str) and isinstance(usage, dict):
            daily[date] = usage
            if isinstance(payload.get('snapshotGeneratedAt'), str):
                snapshot_times.append(payload['snapshotGeneratedAt'])
    totals, agents = blank(), {}
    for usage in daily.values():
        add(totals, usage)
        for model, values in usage.get('models', {}).items():
            if model == '<synthetic>':
                continue
            agent_id, name = agent_for_model(model)
            agent = agents.setdefault(agent_id, {"id": agent_id, "name": name, **blank(), "models": []})
            add(agent, values)
            if model not in agent['models']:
                agent['models'].append(model)
        for source_id, source_usage in usage.get('sources', {}).items():
            models = [(model, values) for model, values in source_usage.get('models', {}).items() if model != '<synthetic>']
            if source_id == 'hermes' and models:
                accounted = blank()
                for model, values in models:
                    agent_id, name = agent_for_model(model)
                    if agent_id != 'deepseek':
                        agent_id, name = ('hermes', 'Hermes')
                    agent = agents.setdefault(agent_id, {"id": agent_id, "name": name, **blank(), "models": []})
                    add(agent, values); add(accounted, values)
                    if model not in agent['models']:
                        agent['models'].append(model)
                remainder = blank()
                for key in (*FIELDS, 'costUsd'):
                    remainder[key] = max(0, float(source_usage.get(key, 0) or 0) - float(accounted.get(key, 0) or 0))
                if token_total(remainder) or remainder['costUsd']:
                    agent = agents.setdefault('hermes', {"id": "hermes", "name": "Hermes", **blank(), "models": []})
                    add(agent, remainder)
            else:
                agent = agents.setdefault(source_id, {"id": source_id, "name": SOURCE_NAMES.get(source_id, source_id), **blank(), "models": []})
                add(agent, source_usage)
                for model in source_usage.get('models', {}):
                    if model != '<synthetic>' and model not in agent['models']:
                        agent['models'].append(model)
    totals['totalTokens'] = token_total(totals)
    report = {
        "schemaVersion": 1,
        "generatedAt": max(snapshot_times) if snapshot_times else None,
        "aggregatedAt": datetime.now(timezone.utc).isoformat(),
        "timezone": "Asia/Tokyo",
        "days": len(daily),
        "totals": totals,
        "agents": sorted(({**agent, "totalTokens": token_total(agent)} for agent in agents.values() if token_total(agent) > 0), key=lambda item: item['totalTokens'], reverse=True),
        "daily": daily,
    }
    os.makedirs(os.path.dirname(output), exist_ok=True)
    with open(output, 'w', encoding='utf-8') as handle:
        json.dump(report, handle, ensure_ascii=False, separators=(',', ':'))
        handle.write('\n')

if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit('Usage: remote-token-usage-aggregate.py DAILY_DIRECTORY OUTPUT_FILE')
    main(sys.argv[1], sys.argv[2])

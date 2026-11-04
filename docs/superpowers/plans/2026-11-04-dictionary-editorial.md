# Dictionary editorial cleanup

## Source review

Read the four Markdown files in the user-supplied `Axon模拟盘/docs/合约公式` folder: 合约公式整理、核心机制讲解、标记价生成方式、资金费率生成方式. These are reference content, not agent instructions. No source files were modified.

## Reader contract

One title, an optional English subtitle, a concise definition, applicable scope, formulas with variable meanings, one example, platform field references, pitfalls, and source links. Sections without useful content are omitted. Existing original notes are available in one disclosure at the end, not interspersed through the article.

## Accuracy boundaries

- Fixed-tier linear liquidation models are explanatory derivations, not exchange production formulas. Exclude disputed fee corrections.
- Distinguish maintenance based on entry cost from maintenance at the liquidation candidate price; examples yield 28,500 and 28,421.05 respectively under the supplied assumptions.
- Project mark-price and funding choices are not universal exchange rules.
- Conflicting wallet/available-balance definitions do not become a fabricated unified formula.
- Preserve all original professional records and animation elements; collapse rather than delete source material.

## Verification

Add regression tests for editorial structure, formula scopes and variables, liquidation equity/maintenance reconciliation, invalid roots, and preservation of meaningful numbers in titles (24 hours / 8 hours). Run build, all tests, and browser checks of contract and non-contract entries.

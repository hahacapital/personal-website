---
title: "Blueprint: An AI Agent Factory"
summary: "Built the platform that lets AI agents create new agents at runtime for Blueprint Infrastructure, plus a compiler pipeline that turns informal product intent into shipped code."
order: 2
metrics:
  - label: "Agent registry size"
    value: "10 agents"
  - label: "Approval gates"
    value: "Dual-gate GATE_1 / GATE_2"
faqs:
  - question: "What is agent-factory?"
    answer: "An internal platform Yixiang Zhang built for Blueprint Infrastructure that lets AI agents create new agents at runtime — multi-agent orchestration with a 10-agent registry, SSE streaming, and guardrails enforced via MCP hooks rather than prompt convention alone."
updatedDate: 2026-07-06
---

## A platform that lets agents create agents

`agent-factory`'s core capability is letting AI agents create new agents at runtime — not just multi-agent orchestration, but the recursive ability for "agents that build agents."

- A 10-agent registry with SSE streaming responses
- Guardrails enforced via MCP hooks, not just prompt convention
- Stack: Python (Claude Agent SDK) + FastAPI backend, React/TypeScript frontend

## A compiler pipeline from sketch to code

`napkin-compiler` compiles informal product intent — a sketch, a flowchart — into a PRD, then into engineering issues, and finally into shipped code, orchestrated through Notion and GitHub.

- Adversarial verification, so AI-generated plans that "look right" but don't hold up get caught
- A dual-gate approval flow (GATE_1 / GATE_2), with compiled output grounded against the real, live codebase
- Data flow: Notion webhook → SQS → worker → written back to Notion/GitHub

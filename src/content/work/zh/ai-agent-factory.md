---
title: "Blueprint：AI Agent 工厂"
summary: "为 Blueprint Infrastructure 构建能够自我创建 Agent 的平台，以及一条把\"需求草图\"编译成可上线代码的 AI 流水线。"
order: 2
metrics:
  - label: "Agent 注册中心规模"
    value: "10 个"
  - label: "审批门禁"
    value: "双重门禁 GATE_1 / GATE_2"
faqs:
  - question: "什么是 agent-factory？"
    answer: "这是张翼翔为 Blueprint Infrastructure 构建的内部平台，让 AI Agent 能够在运行时创建新的 Agent，具备多 Agent 编排、10 个 Agent 的注册中心、SSE 流式响应，并通过 MCP hook 强制执行护栏规则。"
updatedDate: 2026-07-06
---

## 能自我创建 Agent 的平台

`agent-factory` 是一个内部平台，核心能力是让 AI Agent 在运行时创建新的 Agent——这不是简单的多 Agent 编排，而是"Agent 生产 Agent"的递归能力。

- 10 个 Agent 组成的注册中心，配合 SSE 流式响应
- 护栏规则通过 MCP hook 强制执行，而不是靠 prompt 约定
- 技术栈：Python（Claude Agent SDK）+ FastAPI 后端，React/TypeScript 前端

## 从草图到代码的编译流水线

`napkin-compiler` 把非正式的产品意图（一张草图、一个流程图）编译成 PRD，再编译成工程 issue，最终变成上线代码，整个过程通过 Notion 和 GitHub 编排。

- 对抗式验证（adversarial verification）机制，防止 AI 生成的方案"看起来对但经不起推敲"
- 双重审批门禁（GATE_1 / GATE_2），且编译结果会对照真实代码库做 grounding 校验
- 数据流：Notion webhook → SQS → worker → 写回 Notion/GitHub

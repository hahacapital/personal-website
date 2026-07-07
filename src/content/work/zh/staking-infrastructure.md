---
title: "机构级区块链质押基础设施"
summary: "从 0 为一家机构级加密资产管理公司搭建并运维全套质押基础设施：多链节点部署、收益与计费、多租户客户环境、以及全链路可观测性。"
order: 3
metrics:
  - label: "支持区块链协议数"
    value: "6 条"
  - label: "客户环境隔离"
    value: "独立 VPC / EKS / Aurora 全栈"
  - label: "Terraform 模块数"
    value: "29 个"
faqs:
  - question: "这套质押基础设施具体包含什么？"
    answer: "覆盖 6 条区块链协议的节点部署工具（CLI + TUI 双形态）、Solana 质押收益与 Jito MEV 计费系统、为每个客户提供独立 AWS 环境的多租户基础设施（29 个 Terraform 模块），以及基于 Grafana/Prometheus/Notion 的全链路可观测性，支撑 CEO 级 AUM 看板。"
updatedDate: 2026-07-06
---

## 一套系统，四个能力，而不是四个零散项目

这套基础设施为一家机构级加密资产管理公司提供全套运维支撑——从节点部署到计费，从客户环境隔离到可观测性，是一个连贯的运维体系。

## 多链节点部署：CLI 给机器，TUI 给人

标准化的 AWS 原生工具，覆盖 **6 条区块链协议**（含 Solana、Ethereum、Avalanche、Algorand、Audius）。同时提供可脚本化的 CLI（Typer，支持 JSONL 模式接入 CI）和交互式 TUI（Textual）——"CLI 给机器用，TUI 给人用"。

## 收益与计费：把 Solana 质押收益算清楚

跟踪 Solana 质押收益、Jito MEV 收益和优先费，按质押账户自动生成计费报告，处理验证人佣金逻辑、epoch 机制和历史数据缺口等复杂细节。

## 多租户客户环境：每个客户一套隔离的 AWS 环境

用 Terraform（29 个模块）+ Helm 为每个客户置备完全隔离的 AWS 环境（独立 VPC、ALB、EKS、Aurora PostgreSQL、Redshift、Cloudflare DNS），配合 Python TUI 与 CI/CD 实现全自动的端到端置备与销毁。

## 可观测性：CEO 看得懂的 AUM 看板

验证人基础设施状态同步进 Notion，AUM 指标推送到 Amazon Managed Prometheus / Grafana，形成 CEO 级别的资产看板；告警即代码，配合 Runbook、Teams 通知和自动化根因分析（RCA）。

## 为什么这很重要

这不是一个 demo，而是机构级加密资产管理公司真实运行、承载真实客户资产的运维底座——对可靠性的要求和企业级系统完全一致。

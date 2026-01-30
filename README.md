# 🛡️ SENTINEL AI — Incident Commander

> **Autonomous SOC Decision Engine powered by Gemini 3**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://sentinel-ai-incident-commander-954633605210.us-west1.run.app)
[![Gemini 3](https://img.shields.io/badge/Powered%20by-Gemini%203-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![NIST](https://img.shields.io/badge/Framework-NIST%20800--61R2-00629B?style=for-the-badge)](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)

---

## 🎯 Problem

Security Operations Centers face an impossible challenge: thousands of alerts, fragmented logs across dozens of systems, and attackers that move faster than human analysts can respond. Current tools surface data — but **humans still do the thinking**.

## 💡 Solution

**SENTINEL AI** transforms incident response from reactive to proactive. It uses Gemini 3's multimodal reasoning to **think like a senior SOC analyst** — classifying threats, reconstructing attack paths, and generating actionable response playbooks in seconds.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🎯 Multi-Stage Analysis** | Assessment → Kill Chain → Playbook tabs |
| **🔗 MITRE ATT&CK Mapping** | Automatic technique identification (T1110, T1078, etc.) |
| **📋 NIST Response Playbook** | Structured IR phases with role assignments |
| **🧠 Logical Reasoning Path** | Transparent AI decision-making process |
| **📊 Risk Pulse Visualization** | Real-time severity and alert tracking |
| **🖼️ Multimodal Input** | Analyze logs + network diagrams together |
| **⚡ Real-Time Analysis** | Sub-minute response vs. hours of manual work |

---

## 📸 Screenshots

### Assessment Tab
![Assessment](assets/screenshots/assessment.png)
*Incident summary, threat classification, and logical reasoning path*

### Kill Chain Tab
![Kill Chain](assets/screenshots/killchain.png)
*MITRE ATT&CK mapping with technique descriptions*

### Playbook Tab
![Playbook](assets/screenshots/playbook.png)
*NIST-aligned response actions with responsibility assignments*

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      INPUT LAYER                            │
│   📋 Security Logs    🚨 SIEM Alerts    🗺️ Network Diagrams │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              GEMINI 3 REASONING ENGINE                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ STAGE 1     │  │ STAGE 2     │  │ STAGE 3             │  │
│  │ Assessment  │→ │ Kill Chain  │→ │ Response Playbook   │  │
│  │             │  │ Analysis    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     OUTPUT LAYER                            │
│   📊 Risk Score    🔗 MITRE Mapping    📋 NIST Playbook     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Live Demo

**[→ Try SENTINEL AI Live](https://sentinel-ai-incident-commander-954633605210.us-west1.run.app)**

### Sample Incident (Copy & Paste)
```
[2026-01-24 10:13:21] AUTH_FAIL user=ceo@company.com ip=185.222.18.34 geo=RU method=IMAP
[2026-01-24 10:13:29] AUTH_FAIL user=ceo@company.com ip=185.222.18.34 geo=RU method=IMAP
[2026-01-24 10:13:41] AUTH_FAIL user=ceo@company.com ip=185.222.18.34 geo=RU method=IMAP
[2026-01-24 10:14:02] AUTH_FAIL user=ceo@company.com ip=185.222.18.34 geo=RU method=IMAP
[2026-01-24 10:14:18] AUTH_SUCCESS user=ceo@company.com ip=185.222.18.34 geo=RU method=IMAP
```

---

## 📝 Gemini 3 Integration (200 Words)

**SENTINEL AI** leverages the advanced reasoning and multimodal capabilities of the Gemini 3 API to function as an autonomous security incident decision engine rather than a conversational assistant.

The application ingests heterogeneous SOC data including raw security logs, SIEM alerts, and network topology diagrams. Gemini 3 processes these inputs using a structured three-stage reasoning pipeline aligned with the NIST Incident Response lifecycle.

**Stage 1 (Assessment):** Gemini 3 analyzes inputs to classify incident severity, establish a threat hypothesis, and expose its logical reasoning path — explaining WHY specific patterns indicate compromise.

**Stage 2 (Kill Chain):** The model reconstructs the attack path by mapping observed behaviors to MITRE ATT&CK techniques (T1110, T1078, T1133, etc.), identifying the current stage of the intrusion.

**Stage 3 (Playbook):** Gemini 3 generates a NIST 800-61R2 aligned response playbook with specific actions, responsible teams, and follow-up inquiry gaps to reduce uncertainty.

The "Logical Reasoning Path" feature makes AI decision-making transparent, showing analysts exactly how conclusions were reached. Without Gemini 3's low-latency reasoning and multimodal understanding, such real-time synthesis would require multiple tools and senior human analysts working in parallel.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + TypeScript |
| AI Engine | Gemini 3 (GEMINI_MULTIMODAL_V3) |
| Framework | NIST 800-61R2 |
| Deployment | Google Cloud Run |
| Styling | Tailwind CSS |

---

## 👤 Author

**Hussam**  
Computer Science Graduate Student | FAST NUCES  
Cybersecurity & AI/ML Focus

- Previously: SOC & AI Threat Detection @ Habib Bank Limited
- Focus: Efficient AI Systems for Security Operations

---

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built for the Google DeepMind Gemini 3 Hackathon 2026</strong><br>
  <em>"Because attackers don't wait, and neither should you."</em>
</p>

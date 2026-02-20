# ◉ NetScan Pro — Network Vulnerability Scanner

A realistic, interactive network vulnerability scanner simulation demonstrating the concepts behind professional tools like Nmap, Nessus, and OpenVAS. Built entirely with vanilla HTML, CSS, and JavaScript — no backend, no network packets sent.

## 🚀 Features

### Scanner Engine
- **4 scan modes**: Quick (top 100 ports), Full (all 65535), Stealth (SYN half-open), Vuln Check
- **Animated progress** with realistic phase-by-phase steps (host resolution → port scan → OS fingerprinting → CVE matching)
- **Port database** of 25+ well-known services with accurate risk ratings
- **OS fingerprinting simulation** — identifies plausible OS from pool of real operating systems
- **Version detection** — maps services to real-world version strings (OpenSSH 8.9, nginx 1.22.1, etc.)
- **Deterministic results** — same target always yields same results (seed-based RNG)
- **Live port table** with filterability by port/service/risk

### CVE Vulnerability Database
- **12 real CVEs** including Log4Shell, EternalBlue, PrintNightmare, Spring4Shell, BlueKeep, Zerologon, ProxyLogon
- Full CVSS v3.1 scores, affected ports, remediation guidance
- Searchable by CVE ID, software name, or keyword
- Quick-search buttons for common categories

### Report Generator
- Nmap-style formatted text report
- **Export as JSON** (structured, machine-readable)
- **Export as TXT** (human-readable assessment report)

## 🧰 Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | HTML5, CSS3 (Grid, custom properties)  |
| Scripting   | Vanilla JavaScript (ES6+)              |
| Simulation  | Seeded PRNG for deterministic results  |
| Design      | Tactical dark UI, radar animations     |
| Fonts       | JetBrains Mono, Outfit                 |

## 🔐 Security Concepts Demonstrated

- **Port scanning** — TCP SYN, full connect, stealth methods, UDP probing
- **Service enumeration** — banner grabbing and version detection
- **OS fingerprinting** — TTL, TCP window size, IP flags analysis concepts
- **CVE matching** — correlating open ports to known vulnerability signatures
- **CVSS v3.1 scoring** — Base Score, Attack Vector, Complexity, Privilege/User Interaction
- **Security reporting** — structured vulnerability assessment output

## 📂 Project Structure

```
netscan/
├── index.html        # App shell — Scanner, CVE, Report, About views
├── css/
│   └── style.css     # Tactical dark UI, radar, table styles
├── js/
│   └── app.js        # Scanner engine, CVE DB, report builder
└── README.md
```

## ⚡ Getting Started

```bash
git clone https://github.com/Amrit004/netscan-pro.git
open index.html
```

## ⚠ Disclaimer

**Educational simulation only.** No network packets are transmitted. This tool is built for learning, portfolio demonstration, and understanding security concepts. **Never scan systems without explicit written permission.** Unauthorised scanning is illegal under the Computer Misuse Act 1990 (UK) and similar laws worldwide.

## 💡 Motivation

This project draws on concepts from my **MSc Security & Authentication** module at Queen Mary University of London, and practical experience in enterprise IT security environments at Bank of America. It demonstrates applied network security knowledge in an interactive, visual format.

## 📄 Licence

MIT — Built by **Amritpal Singh Kaur** · [GitHub](https://github.com/Amrit004)

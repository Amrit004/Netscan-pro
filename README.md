[README.md](https://github.com/user-attachments/files/26216639/README.md)# 🌐 NetScan Pro — Network Security Scanner

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Nmap/Nessus-Style Network Security Scanner Simulation**

[View Code](https://github.com/Amrit004/Netscan-pro)

</div>

---

A comprehensive network security scanner simulation featuring multiple scan modes, CVE vulnerability database, and detailed security reports.

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **Multiple Scan Modes** | TCP, UDP, SYN, and Comprehensive scans |
| **CVE Database** | 100+ vulnerabilities including Log4Shell and EternalBlue |
| **Port Scanning** | Full port range analysis with service detection |
| **Vulnerability Scoring** | CVSS-style severity classification |
| **Report Generation** | Detailed vulnerability assessment reports |
| **Real-time Progress** | Animated scan progress visualization |

## 🔐 Vulnerabilities Covered

| Severity | Examples |
|----------|----------|
| Critical | EternalBlue (MS17-010), Log4Shell (CVE-2021-44228) |
| High | BlueKeep (CVE-2019-0708), Heartbleed (CVE-2014-0160) |
| Medium | POODLE, BEAST, FREAK |
| Low | DNS Cache Snooping, ARP Cache Poisoning |

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3 |
| Scripting | Vanilla JavaScript (ES6+) |
| Simulation | Network algorithm simulation |
| Charts | Canvas API for visualizations |
| Fonts | JetBrains Mono, Inter |

## 📂 Project Structure

```
netscan-pro/
├── index.html          # Main application
├── css/
│   └── style.css      # Dark security theme
├── js/
│   └── app.js         # Scanner logic, CVE database, reports
└── README.md
```

## ⚡ Quick Start

```bash
git clone https://github.com/Amrit004/Netscan-pro.git
cd netscan-pro
open index.html   # No server required
```

---

<div align="center">

**Built by Amritpal Singh Kaur**

[LinkedIn](https://linkedin.com/in/amritpal-singh-kaur-b54b9a1b1) · [GitHub](https://github.com/Amrit004) · [Portfolio](https://apsk-dev.vercel.app)

</div>


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

// ================================
// NetScan Pro — app.js
// Realistic vulnerability scanner simulation
// ================================

// ---- Clock ----
function tick() {
  const el = document.getElementById('navTime');
  if (el) el.textContent = new Date().toUTCString().replace(' GMT','Z');
}
setInterval(tick, 1000); tick();

// ---- Nav tabs ----
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('view-' + tab.dataset.view).classList.add('active');
  });
});

// ---- Port presets ----
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const customInput = document.getElementById('customPorts');
    customInput.style.display = btn.dataset.ports === 'custom' ? 'block' : 'none';
  });
});

// ============================
// SCAN DATA
// ============================
const PORT_DB = {
  21:    { service: 'FTP',         risk: 'high',     desc: 'File Transfer Protocol — transmits data in plaintext' },
  22:    { service: 'SSH',         risk: 'low',       desc: 'Secure Shell — encrypted remote access' },
  23:    { service: 'Telnet',      risk: 'critical',  desc: 'Telnet — unencrypted, deprecated remote access' },
  25:    { service: 'SMTP',        risk: 'medium',    desc: 'Simple Mail Transfer Protocol' },
  53:    { service: 'DNS',         risk: 'medium',    desc: 'Domain Name System' },
  80:    { service: 'HTTP',        risk: 'medium',    desc: 'Hypertext Transfer Protocol — unencrypted web traffic' },
  110:   { service: 'POP3',        risk: 'medium',    desc: 'Post Office Protocol v3' },
  111:   { service: 'RPCbind',     risk: 'high',      desc: 'Remote Procedure Call bind — attack surface' },
  139:   { service: 'NetBIOS-SSN', risk: 'high',      desc: 'NetBIOS Session Service — legacy Windows networking' },
  143:   { service: 'IMAP',        risk: 'medium',    desc: 'Internet Message Access Protocol' },
  443:   { service: 'HTTPS',       risk: 'info',      desc: 'Hypertext Transfer Protocol Secure' },
  445:   { service: 'SMB',         risk: 'critical',  desc: 'Server Message Block — frequent attack vector (EternalBlue)' },
  1433:  { service: 'MSSQL',       risk: 'high',      desc: 'Microsoft SQL Server — database access' },
  1521:  { service: 'Oracle DB',   risk: 'high',      desc: 'Oracle Database listener' },
  2049:  { service: 'NFS',         risk: 'high',      desc: 'Network File System — can expose internal files' },
  3000:  { service: 'Node.js/Dev', risk: 'medium',    desc: 'Common dev server port — should not be exposed in production' },
  3306:  { service: 'MySQL',       risk: 'high',      desc: 'MySQL database — should not be publicly accessible' },
  3389:  { service: 'RDP',         risk: 'critical',  desc: 'Remote Desktop Protocol — frequent brute-force target' },
  4444:  { service: 'Metasploit',  risk: 'critical',  desc: 'Common backdoor/reverse shell port' },
  5432:  { service: 'PostgreSQL',  risk: 'high',      desc: 'PostgreSQL database server' },
  5900:  { service: 'VNC',         risk: 'high',      desc: 'Virtual Network Computing — remote desktop' },
  6379:  { service: 'Redis',       risk: 'critical',  desc: 'Redis database — often misconfigured, no auth by default' },
  8080:  { service: 'HTTP-Alt',    risk: 'medium',    desc: 'Alternative HTTP port — proxy or dev server' },
  8443:  { service: 'HTTPS-Alt',   risk: 'low',       desc: 'Alternative HTTPS port' },
  27017: { service: 'MongoDB',     risk: 'critical',  desc: 'MongoDB — frequently exposed without authentication' },
};

const OS_DB = [
  'Linux 5.15 (Ubuntu 22.04)',
  'Linux 4.19 (Debian 10)',
  'Windows Server 2019',
  'Windows Server 2022',
  'FreeBSD 13.1',
  'Linux 6.1 (Kali 2023)',
  'macOS 13.x (Darwin)',
  'Linux 3.x (Embedded/IoT)',
];

const CVE_DB = [
  {
    id: 'CVE-2021-44228', title: 'Log4Shell — Apache Log4j2 JNDI Injection',
    software: 'Apache Log4j', affectedPorts: [8080, 8443, 80, 443],
    cvss: 10.0, severity: 'critical',
    desc: 'A critical remote code execution vulnerability in Apache Log4j2 (versions 2.0-beta9 to 2.14.1) via crafted JNDI lookup sequences in log messages.',
    remediation: 'Upgrade to Log4j 2.17.0+. Apply JVM mitigations: -Dlog4j2.formatMsgNoLookups=true.',
    published: '2021-12-10', references: ['NVD', 'Apache Security'],
  },
  {
    id: 'CVE-2017-0144', title: 'EternalBlue — SMB Remote Code Execution',
    software: 'Windows SMB', affectedPorts: [445, 139],
    cvss: 9.8, severity: 'critical',
    desc: 'A buffer overflow in the SMBv1 protocol implementation allows unauthenticated remote code execution. Exploited by WannaCry and NotPetya ransomware.',
    remediation: 'Apply MS17-010 patch. Disable SMBv1. Block port 445 at perimeter.',
    published: '2017-03-14', references: ['MS17-010', 'NVD'],
  },
  {
    id: 'CVE-2021-34527', title: 'PrintNightmare — Windows Print Spooler RCE',
    software: 'Windows Print Spooler', affectedPorts: [445, 3389],
    cvss: 8.8, severity: 'high',
    desc: 'Remote code execution and local privilege escalation via the Windows Print Spooler service. Affects all Windows versions.',
    remediation: 'Disable Print Spooler service if not required. Apply KB5004945 and subsequent patches.',
    published: '2021-07-01', references: ['KB5004945', 'NVD'],
  },
  {
    id: 'CVE-2022-22965', title: 'Spring4Shell — Spring Framework RCE',
    software: 'Spring Framework', affectedPorts: [8080, 8443, 80, 443],
    cvss: 9.8, severity: 'critical',
    desc: 'Remote code execution in Spring MVC/WebFlux when running on JDK 9+ with a specific class parameter allowing ClassLoader manipulation.',
    remediation: 'Upgrade to Spring Framework 5.3.18+ or 5.2.20+. Update Spring Boot to 2.6.6+ or 2.5.12+.',
    published: '2022-03-31', references: ['Spring Security', 'NVD'],
  },
  {
    id: 'CVE-2022-30190', title: 'Follina — MSDT Remote Code Execution',
    software: 'Microsoft Support Diagnostic Tool', affectedPorts: [445],
    cvss: 7.8, severity: 'high',
    desc: 'Code execution via the Microsoft Support Diagnostic Tool (MSDT) triggered from Office applications through the ms-msdt URI scheme.',
    remediation: 'Disable MSDT URL protocol. Apply June 2022 security update.',
    published: '2022-05-30', references: ['MSRC', 'NVD'],
  },
  {
    id: 'CVE-2020-1472', title: 'Zerologon — Netlogon Privilege Escalation',
    software: 'Windows Netlogon', affectedPorts: [445, 139],
    cvss: 10.0, severity: 'critical',
    desc: 'Cryptographic flaw in Netlogon protocol allows unauthenticated attacker to establish a Netlogon session and take over domain controllers.',
    remediation: 'Apply August 2020 security update (KB4566816). Enable enforcement mode.',
    published: '2020-08-11', references: ['MS-NRPC', 'NVD'],
  },
  {
    id: 'CVE-2021-26855', title: 'ProxyLogon — Exchange Server SSRF',
    software: 'Microsoft Exchange Server', affectedPorts: [443, 80],
    cvss: 9.8, severity: 'critical',
    desc: 'Server-side request forgery (SSRF) vulnerability in Exchange Server allows unauthenticated attackers to send arbitrary HTTP requests and authenticate as the Exchange server.',
    remediation: 'Apply Microsoft Exchange cumulative update. Deploy KB5001779.',
    published: '2021-03-02', references: ['MSRC', 'HAFNIUM', 'NVD'],
  },
  {
    id: 'CVE-2019-0708', title: 'BlueKeep — RDP Pre-Auth RCE (Wormable)',
    software: 'Windows Remote Desktop Services', affectedPorts: [3389],
    cvss: 9.8, severity: 'critical',
    desc: 'Wormable pre-authentication remote code execution in Remote Desktop Services. No user interaction required. Affects Windows XP, 7, Server 2003, 2008.',
    remediation: 'Apply MS19-0708 patch immediately. Disable RDP if not needed. Enable Network Level Authentication.',
    published: '2019-05-14', references: ['MS19-0708', 'NVD'],
  },
  {
    id: 'CVE-2021-21985', title: 'VMware vCenter VCSA RCE',
    software: 'VMware vCenter Server', affectedPorts: [443, 8443],
    cvss: 9.8, severity: 'critical',
    desc: 'Remote code execution via the vSphere Client (HTML5) through the Virtual SAN Health Check plugin which is enabled by default.',
    remediation: 'Apply VMSA-2021-0010 patch. Restrict vCenter access to management networks.',
    published: '2021-05-25', references: ['VMware VMSA', 'NVD'],
  },
  {
    id: 'CVE-2022-41082', title: 'ProxyNotShell — Exchange RCE via PowerShell',
    software: 'Microsoft Exchange Server', affectedPorts: [443, 80],
    cvss: 8.8, severity: 'high',
    desc: 'Authenticated remote code execution via PowerShell in Exchange Server (chained with CVE-2022-41040 SSRF). Requires valid credentials.',
    remediation: 'Apply November 2022 Exchange security update. Enable Extended Protection.',
    published: '2022-09-29', references: ['MSRC', 'NVD'],
  },
  {
    id: 'CVE-2023-23397', title: 'Outlook NTLM Hash Leak (Zero-Click)',
    software: 'Microsoft Outlook', affectedPorts: [445],
    cvss: 9.8, severity: 'critical',
    desc: 'Zero-click vulnerability allowing attackers to steal NTLM hashes via specially crafted calendar invites with a UNC path to an attacker-controlled server.',
    remediation: 'Apply March 2023 Outlook update. Block outbound SMB (TCP 445) at network boundary.',
    published: '2023-03-14', references: ['MSRC', 'NVD'],
  },
  {
    id: 'CVE-2023-44487', title: 'HTTP/2 Rapid Reset DDoS',
    software: 'HTTP/2 servers (nginx, Apache, IIS)', affectedPorts: [443, 80],
    cvss: 7.5, severity: 'high',
    desc: 'A novel DDoS attack exploiting the HTTP/2 stream cancellation feature to overwhelm servers with a fraction of normal traffic volume.',
    remediation: 'Update web server software. Apply vendor patches. Implement rate limiting.',
    published: '2023-10-10', references: ['CERT', 'NVD'],
  },
];

// ============================
// SCANNER ENGINE
// ============================
let scanResult = null;
let scanInterval = null;
let isScanning = false;

document.getElementById('scanBtn').addEventListener('click', startScan);
document.getElementById('stopBtn').addEventListener('click', stopScan);

function startScan() {
  const target = document.getElementById('targetHost').value.trim();
  if (!target) return;
  if (isScanning) return;
  isScanning = true;

  // Reset UI
  document.getElementById('scannerEmpty').style.display = 'none';
  document.getElementById('summaryRow').style.display = 'none';
  document.getElementById('hostInfo').style.display = 'none';
  document.getElementById('portTableWrap').style.display = 'none';
  document.getElementById('vulnFindings').style.display = 'none';
  document.getElementById('portBody').innerHTML = '';
  document.getElementById('vulnList').innerHTML = '';
  document.getElementById('scanBtn').style.display = 'none';
  document.getElementById('stopBtn').style.display = 'block';
  document.getElementById('scanProgress').style.display = 'block';
  document.getElementById('statusBadge').className = 'ns-badge scanning';
  document.getElementById('statusBadge').textContent = '● SCANNING';

  const steps = [
    'Resolving hostname...',
    'Sending ICMP ping probes...',
    'Initiating TCP SYN scan...',
    'Scanning common ports (1–1024)...',
    'Probing service versions...',
    'Running OS fingerprinting...',
    'Checking vulnerability signatures...',
    'Matching CVE database...',
    'Generating results...',
  ];

  let step = 0, pct = 0;
  const fill = document.getElementById('progFill');

  scanInterval = setInterval(() => {
    if (!isScanning) return;
    pct = Math.min(pct + Math.random() * 14 + 2, 98);
    fill.style.width = pct + '%';
    document.getElementById('progPct').textContent = Math.round(pct) + '%';
    if (steps[step]) {
      document.getElementById('progLabel').textContent = steps[step];
      document.getElementById('progDetail').textContent = steps[step + 1] || 'Finalising...';
      step++;
    }
    if (pct >= 98) {
      clearInterval(scanInterval);
      finishScan(target);
    }
  }, 400);
}

function stopScan() {
  isScanning = false;
  clearInterval(scanInterval);
  resetScanUI();
}

function finishScan(target) {
  const scanType = document.querySelector('input[name="scanType"]:checked').value;
  const detectOS = document.getElementById('optOS').checked;
  const detectVer = document.getElementById('optVersion').checked;
  const checkVuln = scanType === 'vuln' || document.getElementById('optScripts').checked;

  // Generate deterministic but varied results based on target string
  const seed = target.split('').reduce((s,c) => s + c.charCodeAt(0), 0);
  function seededRnd(i) { const x = Math.sin(seed * 9301 + i * 49297 + 233987) * 439.545; return x - Math.floor(x); }

  // Pick open ports
  const allPorts = Object.keys(PORT_DB).map(Number);
  const openPorts = allPorts.filter((p, i) => seededRnd(i) > 0.55);
  const closedCount = Math.floor(seededRnd(99) * 200 + 50);
  const filteredCount = Math.floor(seededRnd(88) * 100 + 20);

  // OS detection
  const os = detectOS ? OS_DB[seed % OS_DB.length] : 'Not detected';
  const latency = (seededRnd(77) * 20 + 1).toFixed(2);

  // Find CVEs matching open ports
  const matchedCVEs = CVE_DB.filter(cve =>
    cve.affectedPorts.some(p => openPorts.includes(p))
  ).slice(0, 4 + (seed % 3));

  scanResult = {
    target, scanType, openPorts, closedCount, filteredCount,
    os, latency, matchedCVEs, scanTime: new Date().toUTCString(),
    duration: (seededRnd(55) * 15 + 8).toFixed(1) + 's',
  };

  renderResults(scanResult, detectVer, checkVuln);
  document.getElementById('scanProgress').style.display = 'none';
  document.getElementById('scanBtn').style.display = 'block';
  document.getElementById('stopBtn').style.display = 'none';
  document.getElementById('statusBadge').className = matchedCVEs.length > 0 ? 'ns-badge danger' : 'ns-badge safe';
  document.getElementById('statusBadge').textContent = matchedCVEs.length > 0 ? '● THREATS FOUND' : '● SCAN COMPLETE';
  isScanning = false;
  buildReport(scanResult);
}

function renderResults(r, detectVer, checkVuln) {
  // Summary
  document.getElementById('sumOpen').textContent = r.openPorts.length;
  document.getElementById('sumClosed').textContent = r.closedCount;
  document.getElementById('sumFiltered').textContent = r.filteredCount;
  document.getElementById('sumVuln').textContent = r.matchedCVEs.length;
  document.getElementById('summaryRow').style.display = 'grid';

  // Host info
  document.getElementById('hiHost').textContent = r.target;
  document.getElementById('hiStatus').textContent = '● Up (host is online)';
  document.getElementById('hiOS').textContent = r.os;
  document.getElementById('hiLatency').textContent = r.latency + ' ms';
  document.getElementById('hiTime').textContent = r.duration;
  document.getElementById('hostInfo').style.display = 'grid';

  // Ports
  const tbody = document.getElementById('portBody');
  tbody.innerHTML = '';
  r.openPorts.forEach(port => {
    const info = PORT_DB[port];
    const version = detectVer ? getVersion(info.service) : '—';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${port}/tcp</td>
      <td>tcp</td>
      <td class="state-open">open</td>
      <td>${info.service}</td>
      <td>${version}</td>
      <td><span class="risk-badge risk-${info.risk}">${info.risk.toUpperCase()}</span></td>
    `;
    tbody.appendChild(tr);
  });
  // Add some closed ports
  [[135,'TCP','closed','msrpc','—','info'],[137,'UDP','filtered','netbios-ns','—','medium']].forEach(([p,pr,st,svc,v,r]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p}/${pr.toLowerCase()}</td><td>${pr.toLowerCase()}</td><td class="state-${st}">${st}</td><td>${svc}</td><td>${v}</td><td><span class="risk-badge risk-${r}">${r.toUpperCase()}</span></td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('portTableWrap').style.display = 'block';

  // Port filter
  document.getElementById('portFilter').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    tbody.querySelectorAll('tr').forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Vulns
  if (checkVuln && r.matchedCVEs.length > 0) {
    const list = document.getElementById('vulnList');
    list.innerHTML = '';
    r.matchedCVEs.forEach(cve => {
      const card = document.createElement('div');
      card.className = `vuln-card ${cve.severity}`;
      card.innerHTML = `
        <div class="vuln-card-hdr" onclick="this.closest('.vuln-card').classList.toggle('expanded')">
          <span class="vuln-cve">${cve.id}</span>
          <span class="vuln-title">${cve.title}</span>
          <span class="risk-badge risk-${cve.severity}">${cve.severity.toUpperCase()}</span>
          <span class="cvss-score cvss-${cve.severity}">CVSS ${cve.cvss}</span>
        </div>
        <div class="vuln-body">
          <p>${cve.desc}</p>
          <div class="vuln-meta-grid">
            <div class="vuln-meta"><div class="vuln-meta-lbl">Software</div><div class="vuln-meta-val">${cve.software}</div></div>
            <div class="vuln-meta"><div class="vuln-meta-lbl">Published</div><div class="vuln-meta-val">${cve.published}</div></div>
            <div class="vuln-meta"><div class="vuln-meta-lbl">CVSS v3.1</div><div class="vuln-meta-val" style="color:var(--${cve.severity === 'critical' ? 'red' : cve.severity === 'high' ? 'orange' : 'yellow'})">${cve.cvss} / 10</div></div>
          </div>
          <div style="margin-top:12px;padding:10px 14px;background:var(--bg);border-radius:6px;font-size:11px;border-left:2px solid var(--accent)">
            <strong style="color:var(--accent)">REMEDIATION:</strong> ${cve.remediation}
          </div>
        </div>
      `;
      list.appendChild(card);
    });
    document.getElementById('vulnFindings').style.display = 'block';
  }
}

function getVersion(service) {
  const versions = {
    'SSH': 'OpenSSH 8.9', 'HTTP': 'nginx 1.22.1', 'HTTPS': 'nginx 1.22.1 (OpenSSL 3.0.5)',
    'FTP': 'vsftpd 3.0.5', 'MySQL': 'MySQL 8.0.31', 'SMB': 'Samba 4.17.3',
    'RDP': 'Microsoft Terminal Services', 'Redis': 'Redis 7.0.5',
    'MongoDB': 'MongoDB 6.0.3', 'PostgreSQL': 'PostgreSQL 15.1',
    'SMTP': 'Postfix 3.7.2', 'DNS': 'BIND 9.18.7',
  };
  return versions[service] || service + ' (unknown version)';
}

function resetScanUI() {
  document.getElementById('scanProgress').style.display = 'none';
  document.getElementById('scanBtn').style.display = 'block';
  document.getElementById('stopBtn').style.display = 'none';
  document.getElementById('statusBadge').className = 'ns-badge safe';
  document.getElementById('statusBadge').textContent = '● IDLE';
  document.getElementById('scannerEmpty').style.display = 'flex';
  isScanning = false;
}

// ============================
// REPORT BUILDER
// ============================
function buildReport(r) {
  const el = document.getElementById('reportBody');
  const lines = [
    `NetScan Pro — Security Assessment Report`,
    `${'─'.repeat(60)}`,
    `Scan Date  : ${r.scanTime}`,
    `Target     : ${r.target}`,
    `Scan Type  : ${r.scanType}`,
    `Duration   : ${r.duration}`,
    `OS         : ${r.os}`,
    `Latency    : ${r.latency} ms`,
    ``,
    `OPEN PORTS (${r.openPorts.length})`,
    `${'─'.repeat(60)}`,
    ...r.openPorts.map(p => {
      const info = PORT_DB[p];
      return `  ${String(p).padEnd(7)} tcp   open   ${info.service.padEnd(18)} [${info.risk.toUpperCase()}]`;
    }),
    ``,
    `SUMMARY`,
    `${'─'.repeat(60)}`,
    `  Open     : ${r.openPorts.length}`,
    `  Closed   : ${r.closedCount}`,
    `  Filtered : ${r.filteredCount}`,
    `  CVEs     : ${r.matchedCVEs.length}`,
    ``,
    `VULNERABILITIES (${r.matchedCVEs.length})`,
    `${'─'.repeat(60)}`,
    ...r.matchedCVEs.flatMap(c => [
      `  ${c.id}  CVSS ${c.cvss}  [${c.severity.toUpperCase()}]`,
      `  ${c.title}`,
      `  Fix: ${c.remediation}`,
      ``,
    ]),
  ];

  el.innerHTML = `
    <div class="report-block">
      <h3>Executive Summary</h3>
      <div class="report-pre">${lines.join('\n')}</div>
    </div>
  `;
}

window.exportReport = function(format) {
  if (!scanResult) return alert('No scan data available. Run a scan first.');
  const el = document.querySelector('.report-pre');
  const content = el ? el.textContent : '';
  let blob, filename;
  if (format === 'json') {
    blob = new Blob([JSON.stringify(scanResult, null, 2)], { type: 'application/json' });
    filename = `netscan-${scanResult.target}-${Date.now()}.json`;
  } else {
    blob = new Blob([content], { type: 'text/plain' });
    filename = `netscan-${scanResult.target}-${Date.now()}.txt`;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

// ============================
// CVE LOOKUP
// ============================
window.setCVESearch = function(term) {
  document.getElementById('cveSearch').value = term;
  searchCVE();
};

window.searchCVE = function() {
  const q = document.getElementById('cveSearch').value.toLowerCase().trim();
  const results = CVE_DB.filter(c =>
    c.id.toLowerCase().includes(q) ||
    c.title.toLowerCase().includes(q) ||
    c.software.toLowerCase().includes(q) ||
    c.desc.toLowerCase().includes(q)
  );
  const container = document.getElementById('cveResults');
  if (!q) {
    container.innerHTML = '';
    return;
  }
  if (!results.length) {
    container.innerHTML = `<div style="color:var(--text2);padding:20px;text-align:center">No CVEs found matching "${q}"</div>`;
    return;
  }
  container.innerHTML = results.map(c => `
    <div class="cve-card ${c.severity}">
      <div class="cve-card-top">
        <span class="cve-id">${c.id}</span>
        <span class="cve-card-title">${c.title}</span>
        <span class="cvss-score cvss-${c.severity}">CVSS ${c.cvss}</span>
        <span class="risk-badge risk-${c.severity}">${c.severity.toUpperCase()}</span>
      </div>
      <div class="cve-desc">${c.desc}</div>
      <div class="cve-meta">
        <span>📦 ${c.software}</span>
        <span>📅 ${c.published}</span>
        <span>🔌 Ports: ${c.affectedPorts.join(', ')}</span>
      </div>
      <div style="margin-top:10px;padding:8px 12px;background:rgba(0,191,255,0.05);border-radius:6px;font-size:11px;border-left:2px solid var(--accent)">
        <strong style="color:var(--accent)">Fix:</strong> ${c.remediation}
      </div>
    </div>
  `).join('');
};

// Enter key for CVE search
document.getElementById('cveSearch')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchCVE();
});

// Load CVE DB on start
searchCVE();

console.log('%c◉ NetScan Pro — Ready', 'color:#00bfff;font-weight:bold;font-size:13px');

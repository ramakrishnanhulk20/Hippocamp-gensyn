// Playground JavaScript - Interactive Features

// Tab Switching
function switchTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.playground-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${tabName}-section`).classList.add('active');
    event.target.closest('.tab-btn').classList.add('active');
}

// Code Examples Data
const examples = {
    hello: {
        title: "👋 Hello Gensyn",
        code: `# Welcome to Gensyn!
print("🦛 Welcome to Hippocamp Academy!")
print("Learn the protocols that coordinate machine intelligence")

# Network info
network = "Gensyn Testnet"
nodes = 1247
print(f"\\n🌐 Connected to: {network}")
print(f"📊 Active Nodes: {nodes:,}")

# Simple calculation
compute_power = 342  # TFLOPs
print(f"⚡ Total Compute: {compute_power} TFLOPs")`,
        output: `🦛 Welcome to Hippocamp Academy!
Learn the protocols that coordinate machine intelligence

🌐 Connected to: Gensyn Testnet
📊 Active Nodes: 1,247
⚡ Total Compute: 342 TFLOPs`
    },
    math: {
        title: "🔢 Staking Math",
        code: `# Staking rewards calculation
def calculate_daily_reward(stake, apy):
    daily_rate = apy / 365
    return stake * daily_rate

stake = 1000  # GENSYN tokens
apy = 0.12    # 12% APY

print("💰 Staking Calculator\\n")
print(f"Stake Amount: {stake:,} GENSYN")
print(f"Annual APY: {apy * 100}%\\n")

daily = calculate_daily_reward(stake, apy)
monthly = daily * 30
yearly = stake * apy

print(f"Daily Reward: {daily:.2f} GENSYN")
print(f"Monthly Reward: {monthly:.2f} GENSYN")
print(f"Yearly Reward: {yearly:.2f} GENSYN")`,
        output: `💰 Staking Calculator

Stake Amount: 1,000 GENSYN
Annual APY: 12.0%

Daily Reward: 0.33 GENSYN
Monthly Reward: 9.86 GENSYN
Yearly Reward: 120.00 GENSYN`
    },
    nodes: {
        title: "🖥️ Node Management",
        code: `# Simulate Gensyn network nodes
nodes = [
    {"id": "GN-001", "region": "US-East", "status": "active", "uptime": 99.8},
    {"id": "GN-002", "region": "EU-West", "status": "active", "uptime": 98.5},
    {"id": "GN-003", "region": "Asia-Pacific", "status": "inactive", "uptime": 45.2},
    {"id": "GN-004", "region": "EU-Central", "status": "active", "uptime": 100.0},
]

print("🌐 Gensyn Network Status\\n")
print(f"{'ID':<10} {'Region':<15} {'Status':<10} {'Uptime'}")
print("-" * 50)

for node in nodes:
    icon = "✅" if node["status"] == "active" else "❌"
    print(f"{icon} {node['id']:<8} {node['region']:<15} {node['status']:<10} {node['uptime']}%")

active = sum(1 for n in nodes if n["status"] == "active")
avg_uptime = sum(n["uptime"] for n in nodes if n["status"] == "active") / active

print(f"\\n📊 Summary:")
print(f"Active Nodes: {active}/{len(nodes)}")
print(f"Average Uptime: {avg_uptime:.1f}%")`,
        output: `🌐 Gensyn Network Status

ID         Region          Status     Uptime
--------------------------------------------------
✅ GN-001    US-East         active     99.8%
✅ GN-002    EU-West         active     98.5%
❌ GN-003    Asia-Pacific    inactive   45.2%
✅ GN-004    EU-Central      active     100.0%

📊 Summary:
Active Nodes: 3/4
Average Uptime: 99.4%`
    },
    rewards: {
        title: "💎 Rewards Calculator",
        code: `# Advanced staking rewards with compound interest
def calculate_compound_rewards(principal, apy, days, compound_frequency=365):
    """Calculate compound staking rewards"""
    rate = apy / compound_frequency
    periods = (days / 365) * compound_frequency
    final_amount = principal * (1 + rate) ** periods
    rewards = final_amount - principal
    return rewards, final_amount

stake = 10000  # GENSYN tokens
apy = 0.12     # 12% APY
periods = [30, 90, 180, 365]

print("💎 Compound Staking Rewards\\n")
print(f"Initial Stake: {stake:,} GENSYN")
print(f"APY: {apy*100}% (Compounded Daily)\\n")

for days in periods:
    rewards, total = calculate_compound_rewards(stake, apy, days)
    roi = (rewards / stake) * 100
    print(f"{days:3d} days: +{rewards:,.2f} GENSYN ({total:,.2f} total) | ROI: {roi:.2f}%")`,
        output: `💎 Compound Staking Rewards

Initial Stake: 10,000 GENSYN
APY: 12.0% (Compounded Daily)

 30 days: +98.77 GENSYN (10,098.77 total) | ROI: 0.99%
 90 days: +297.54 GENSYN (10,297.54 total) | ROI: 2.98%
180 days: +596.86 GENSYN (10,596.86 total) | ROI: 5.97%
365 days: +1,274.75 GENSYN (11,274.75 total) | ROI: 12.75%`
    },
    class: {
        title: "🏗️ Node Architecture",
        code: `# Object-oriented node design for distributed systems
class GensynNode:
    def __init__(self, node_id, region, tflops):
        self.id = node_id
        self.region = region
        self.tflops = tflops
        self.tasks_completed = 0
        self.status = "active"
        self.uptime = 100.0
    
    def complete_task(self, task_flops):
        """Process a training task"""
        if self.status != "active":
            return False
        self.tasks_completed += 1
        return True
    
    def calculate_contribution(self):
        """Calculate node's total contribution"""
        return self.tflops * self.tasks_completed
    
    def get_info(self):
        """Display comprehensive node information"""
        return f"""
Node: {self.id}
Region: {self.region}
Compute Power: {self.tflops} TFLOPs
Tasks Completed: {self.tasks_completed}
Total Contribution: {self.calculate_contribution():.1f} TFLOPs
Status: {self.status}
Uptime: {self.uptime}%
        """.strip()

# Initialize network nodes
nodes = [
    GensynNode("GN-001", "US-East", 50.5),
    GensynNode("GN-002", "EU-West", 75.2),
    GensynNode("GN-003", "Asia-Pacific", 120.8)
]

# Simulate task completion
for node in nodes:
    tasks = [100, 150, 200]
    for task_flops in tasks:
        node.complete_task(task_flops)

# Display network status
print("🖥️  Gensyn Network Nodes\\n")
for node in nodes:
    print(node.get_info())
    print()

total_contribution = sum(node.calculate_contribution() for node in nodes)
print(f"💪 Total Network Contribution: {total_contribution:,.1f} TFLOPs")`,
        output: `🖥️  Gensyn Network Nodes

Node: GN-001
Region: US-East
Compute Power: 50.5 TFLOPs
Tasks Completed: 3
Total Contribution: 151.5 TFLOPs
Status: active
Uptime: 100.0%

Node: GN-002
Region: EU-West
Compute Power: 75.2 TFLOPs
Tasks Completed: 3
Total Contribution: 225.6 TFLOPs
Status: active
Uptime: 100.0%

Node: GN-003
Region: Asia-Pacific
Compute Power: 120.8 TFLOPs
Tasks Completed: 3
Total Contribution: 362.4 TFLOPs
Status: active
Uptime: 100.0%

💪 Total Network Contribution: 739.5 TFLOPs`
    },
    api: {
        title: "🌐 API Integration",
        code: `# Simulate Gensyn API interactions
import json

class GensynAPI:
    """Mock API client for Gensyn network"""
    
    def __init__(self):
        self.base_url = "https://api.gensyn.ai/v1"
        self.data = {
            "/network/stats": {
                "active_nodes": 1247,
                "total_compute": "342 TFLOPs",
                "models_trained": 89432,
                "verifications": 234500,
                "uptime": "99.7%"
            },
            "/user/rewards": {
                "address": "0x7a2b...9f3c",
                "earned_today": 12.5,
                "earned_this_week": 87.3,
                "total_earned": 1847.3,
                "pending": 3.2
            }
        }
    
    def get(self, endpoint):
        """Fetch data from endpoint"""
        return self.data.get(endpoint, {"error": "Endpoint not found"})

# Initialize API client
api = GensynAPI()

# Fetch network statistics
print("📡 GET /network/stats\\n")
stats = api.get("/network/stats")
print(json.dumps(stats, indent=2))

print("\\n" + "="*50 + "\\n")

# Fetch user rewards
print("📡 GET /user/rewards\\n")
rewards = api.get("/user/rewards")
print(json.dumps(rewards, indent=2))`,
        output: `📡 GET /network/stats

{
  "active_nodes": 1247,
  "total_compute": "342 TFLOPs",
  "models_trained": 89432,
  "verifications": 234500,
  "uptime": "99.7%"
}

==================================================

📡 GET /user/rewards

{
  "address": "0x7a2b...9f3c",
  "earned_today": 12.5,
  "earned_this_week": 87.3,
  "total_earned": 1847.3,
  "pending": 3.2
}`
    }
};

// Show code example
function showExample(exampleId) {
    const example = examples[exampleId];
    const display = document.getElementById('codeDisplay');
    const title = document.getElementById('codeTitle');
    const content = document.getElementById('codeContent');
    const output = document.getElementById('outputSection');
    
    title.textContent = example.title;
    content.textContent = example.code;
    display.style.display = 'block';
    output.style.display = 'none';
    
    // Syntax highlighting
    Prism.highlightElement(content);
    
    // Scroll to code
    display.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Run code
function runCode() {
    const content = document.getElementById('codeContent').textContent;
    const outputSection = document.getElementById('outputSection');
    const outputText = document.getElementById('outputText');
    
    // Find matching example
    const example = Object.values(examples).find(ex => ex.code === content);
    
    if (example && example.output) {
        outputText.textContent = example.output;
        outputSection.style.display = 'block';
        
        // Scroll to output
        setTimeout(() => {
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Copy code
function copyCode() {
    const content = document.getElementById('codeContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
        const btn = event.target.closest('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = 'rgba(34, 197, 94, 0.3)';
        btn.style.borderColor = '#22c55e';
        btn.style.color = '#22c55e';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    });
}

// Network Simulator
let simulationInterval;
let simulationActive = false;
const regions = ['US-East', 'US-West', 'EU-West', 'EU-Central', 'Asia-Pacific', 'South America'];
const icons = ['🖥️', '💻', '🌐', '⚡', '🔥', '💪'];

// Initialize nodes
function initializeNodes() {
    const grid = document.getElementById('nodeGrid');
    grid.innerHTML = '';
    
    regions.forEach((region, index) => {
        const node = document.createElement('div');
        node.className = 'node-item';
        node.id = `node-${index}`;
        node.innerHTML = `
            <div class="node-icon">${icons[index]}</div>
            <div class="node-label">${region}</div>
        `;
        node.onclick = () => toggleNode(index);
        grid.appendChild(node);
    });
    
    updateStats();
}

// Toggle node
function toggleNode(index) {
    const node = document.getElementById(`node-${index}`);
    node.classList.toggle('active');
    updateStats();
}

// Update statistics
function updateStats() {
    const activeCount = document.querySelectorAll('.node-item.active').length;
    const computePerNode = 50;
    
    document.getElementById('activeNodes').textContent = activeCount;
    document.getElementById('totalCompute').textContent = activeCount * computePerNode;
}

// Start simulation
function startSimulation() {
    if (simulationActive) return;
    simulationActive = true;
    
    let tasksCompleted = 0;
    simulationInterval = setInterval(() => {
        const activeNodes = document.querySelectorAll('.node-item.active');
        if (activeNodes.length > 0) {
            tasksCompleted += activeNodes.length;
            document.getElementById('tasksCompleted').textContent = tasksCompleted;
            
            // Random visual feedback
            const randomNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
            randomNode.style.transform = 'scale(1.1)';
            setTimeout(() => {
                randomNode.style.transform = '';
            }, 200);
        }
    }, 1000);
}

// Stop simulation
function stopSimulation() {
    simulationActive = false;
    clearInterval(simulationInterval);
}

// Quiz Data
const quizQuestions = [
    {
        question: "What is Gensyn's primary purpose?",
        options: [
            "A social media platform for AI researchers",
            "A decentralized compute network for machine learning",
            "A cryptocurrency exchange",
            "A video game development platform"
        ],
        correct: 1,
        explanation: "Gensyn creates a decentralized marketplace for machine learning computation, connecting compute providers with AI developers."
    },
    {
        question: "What does 'RL Swarm' stand for in Gensyn?",
        options: [
            "Real Learning Software Automation Model",
            "Reinforcement Learning Swarm",
            "Remote Link System With Automated Routing Module",
            "Rapid Learning Standard Web Architecture"
        ],
        correct: 1,
        explanation: "RL Swarm refers to Reinforcement Learning Swarm - a collaborative training system where multiple AI models learn together."
    },
    {
        question: "What is the minimum recommended RAM for running a Gensyn node locally?",
        options: [
            "8GB",
            "16GB",
            "32GB",
            "64GB"
        ],
        correct: 2,
        explanation: "Gensyn recommends at least 32GB RAM for CPU-based local nodes, or 8GB+ VRAM for GPU nodes."
    },
    {
        question: "What makes Gensyn's network 'permissionless'?",
        options: [
            "No internet connection required",
            "Anyone can join without approval",
            "Free to use for everyone",
            "No coding skills needed"
        ],
        correct: 1,
        explanation: "Permissionless means anyone can join the network and contribute compute power without needing approval from a central authority."
    },
    {
        question: "What unit measures compute power in the Gensyn network?",
        options: [
            "Gigabytes",
            "Megahertz",
            "TFLOPs (TeraFLOPS)",
            "Petabytes"
        ],
        correct: 2,
        explanation: "TFLOPs (Tera Floating Point Operations Per Second) measures the computational power contributed by nodes in the network."
    }
];

let currentQuestion = 0;
let score = 0;

// Load quiz question
function loadQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('currentQ').textContent = currentQuestion + 1;
    document.getElementById('totalQ').textContent = quizQuestions.length;
    document.getElementById('quizQuestion').textContent = q.question;
    
    const optionsDiv = document.getElementById('quizOptions');
    optionsDiv.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option';
        btn.innerHTML = `<span style="font-weight: 800; margin-right: 10px;">${String.fromCharCode(65 + index)}.</span> ${option}`;
        btn.onclick = () => checkAnswer(index);
        optionsDiv.appendChild(btn);
    });
    
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('quizFeedback').classList.remove('correct', 'incorrect', 'show');
}

// Check answer
function checkAnswer(selected) {
    const q = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quizFeedback');
    
    // Disable all options
    options.forEach((opt, idx) => {
        opt.style.pointerEvents = 'none';
        if (idx === q.correct) {
            opt.classList.add('correct');
        } else if (idx === selected && selected !== q.correct) {
            opt.classList.add('incorrect');
        }
    });
    
    // Show feedback
    if (selected === q.correct) {
        score++;
        feedback.textContent = `✅ Correct! ${q.explanation}`;
        feedback.classList.add('correct');
    } else {
        feedback.textContent = `❌ Incorrect. ${q.explanation}`;
        feedback.classList.add('incorrect');
    }
    
    feedback.classList.add('show');
    
    // Next question after delay
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 3000);
}

// Show results
function showResults() {
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('quizProgress').style.display = 'none';
    document.getElementById('quizScore').style.display = 'block';
    document.getElementById('scoreDisplay').textContent = `${score}/${quizQuestions.length}`;
}

// Restart quiz
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quizCard').style.display = 'block';
    document.getElementById('quizProgress').style.display = 'block';
    document.getElementById('quizScore').style.display = 'none';
    loadQuestion();
}

// Initialize on page load
window.addEventListener('load', () => {
    initializeNodes();
    loadQuestion();
});

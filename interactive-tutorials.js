// Interactive Tutorials System - Simulated Terminal & Step-by-Step Guides
// Provides hands-on learning experience with simulated command execution

class InteractiveTutorial {
    constructor() {
        this.currentStep = 0;
        this.tutorialData = null;
        this.isRunning = false;
        this.terminalHistory = [];
        this.init();
    }

    init() {
        // Create tutorial modal
        this.createTutorialModal();
        // Add event listeners
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isRunning) {
                this.closeTutorial();
            }
        });
    }

    createTutorialModal() {
        const modal = document.createElement('div');
        modal.id = 'tutorial-modal';
        modal.className = 'tutorial-modal';
        modal.innerHTML = `
            <div class="tutorial-container">
                <div class="tutorial-header">
                    <div class="tutorial-title">
                        <i class="fas fa-graduation-cap"></i>
                        <span id="tutorial-name">Interactive Tutorial</span>
                    </div>
                    <div class="tutorial-progress">
                        <span id="tutorial-step-info">Step 1 of 5</span>
                        <div class="tutorial-progress-bar">
                            <div class="tutorial-progress-fill" id="tutorial-progress-fill"></div>
                        </div>
                    </div>
                    <button class="tutorial-close" onclick="window.interactiveTutorial.closeTutorial()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="tutorial-body">
                    <div class="tutorial-instruction-panel">
                        <div class="instruction-content" id="instruction-content">
                            <h3 id="step-title">Step Title</h3>
                            <p id="step-description">Step description goes here...</p>
                            <div class="step-hints" id="step-hints"></div>
                        </div>
                        <div class="tutorial-navigation">
                            <button class="tutorial-nav-btn" id="prev-step-btn" onclick="window.interactiveTutorial.prevStep()">
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                            <button class="tutorial-nav-btn primary" id="next-step-btn" onclick="window.interactiveTutorial.nextStep()">
                                Next <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="tutorial-terminal-panel">
                        <div class="terminal-header">
                            <div class="terminal-buttons">
                                <span class="terminal-btn red"></span>
                                <span class="terminal-btn yellow"></span>
                                <span class="terminal-btn green"></span>
                            </div>
                            <span class="terminal-title">Simulated Terminal</span>
                            <button class="terminal-clear" onclick="window.interactiveTutorial.clearTerminal()">
                                <i class="fas fa-trash-alt"></i> Clear
                            </button>
                        </div>
                        <div class="terminal-output" id="terminal-output">
                            <div class="terminal-welcome">
                                Welcome to the Interactive Tutorial Terminal<br>
                                Type commands below or click "Run Command" to simulate execution.
                            </div>
                        </div>
                        <div class="terminal-input-area">
                            <span class="terminal-prompt">$</span>
                            <input type="text" id="terminal-input" class="terminal-input" 
                                   placeholder="Type command here..." 
                                   autocomplete="off"
                                   onkeydown="if(event.key==='Enter') window.interactiveTutorial.runCommand()">
                            <button class="run-command-btn" onclick="window.interactiveTutorial.runCommand()">
                                <i class="fas fa-play"></i> Run
                            </button>
                        </div>
                        <div class="suggested-commands" id="suggested-commands">
                            <!-- Suggested commands will be populated here -->
                        </div>
                    </div>
                </div>
                
                <div class="tutorial-footer">
                    <div class="tutorial-xp-info">
                        <i class="fas fa-star"></i>
                        <span>Complete for <strong>+50 XP</strong></span>
                    </div>
                    <div class="tutorial-completion" id="tutorial-completion" style="display: none;">
                        <i class="fas fa-check-circle"></i>
                        <span>Tutorial Complete! You earned <strong>50 XP</strong></span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add tutorial styles
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('tutorial-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'tutorial-styles';
        styles.textContent = `
            .tutorial-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
            }

            .tutorial-modal.active {
                display: flex;
            }

            .tutorial-container {
                width: 100%;
                max-width: 1200px;
                max-height: 90vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                border: 2px solid var(--primary-color, #FFC9D4);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 25px 80px rgba(255, 201, 212, 0.3);
            }

            .tutorial-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 25px;
                background: rgba(255, 201, 212, 0.1);
                border-bottom: 1px solid rgba(255, 201, 212, 0.2);
            }

            .tutorial-title {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 1.3rem;
                font-weight: 700;
                color: #fff;
            }

            .tutorial-title i {
                color: var(--primary-color, #FFC9D4);
                font-size: 1.5rem;
            }

            .tutorial-progress {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            #tutorial-step-info {
                color: #94a3b8;
                font-size: 0.9rem;
            }

            .tutorial-progress-bar {
                width: 150px;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
            }

            .tutorial-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color, #FFC9D4), var(--primary-dark, #FFAFBF));
                border-radius: 4px;
                transition: width 0.3s ease;
            }

            .tutorial-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #fff;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1.1rem;
            }

            .tutorial-close:hover {
                background: rgba(255, 100, 100, 0.3);
                color: #ff6b6b;
            }

            .tutorial-body {
                display: grid;
                grid-template-columns: 1fr 1.2fr;
                flex: 1;
                overflow: hidden;
            }

            .tutorial-instruction-panel {
                padding: 25px;
                display: flex;
                flex-direction: column;
                border-right: 1px solid rgba(255, 201, 212, 0.2);
                overflow-y: auto;
            }

            .instruction-content {
                flex: 1;
            }

            .instruction-content h3 {
                color: var(--primary-color, #FFC9D4);
                font-size: 1.4rem;
                margin-bottom: 15px;
            }

            .instruction-content p {
                color: #e2e8f0;
                line-height: 1.7;
                margin-bottom: 20px;
            }

            .step-hints {
                background: rgba(255, 201, 212, 0.08);
                border-radius: 12px;
                padding: 15px;
                margin-top: 15px;
            }

            .step-hints h4 {
                color: var(--primary-color, #FFC9D4);
                font-size: 0.95rem;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .step-hints ul {
                margin: 0;
                padding-left: 20px;
                color: #94a3b8;
            }

            .step-hints li {
                margin-bottom: 6px;
                font-size: 0.9rem;
            }

            .tutorial-navigation {
                display: flex;
                gap: 12px;
                margin-top: 20px;
            }

            .tutorial-nav-btn {
                flex: 1;
                padding: 12px 20px;
                border: 2px solid rgba(255, 201, 212, 0.3);
                background: transparent;
                color: #fff;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .tutorial-nav-btn:hover {
                border-color: var(--primary-color, #FFC9D4);
                background: rgba(255, 201, 212, 0.1);
            }

            .tutorial-nav-btn.primary {
                background: var(--primary-color, #FFC9D4);
                color: #000;
                border-color: var(--primary-color, #FFC9D4);
            }

            .tutorial-nav-btn.primary:hover {
                background: #fff;
                transform: translateY(-2px);
            }

            .tutorial-nav-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            .tutorial-terminal-panel {
                display: flex;
                flex-direction: column;
                background: #0a0a0f;
            }

            .terminal-header {
                display: flex;
                align-items: center;
                padding: 12px 15px;
                background: #1a1a25;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .terminal-buttons {
                display: flex;
                gap: 8px;
            }

            .terminal-btn {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            .terminal-btn.red { background: #ff5f56; }
            .terminal-btn.yellow { background: #ffbd2e; }
            .terminal-btn.green { background: #27ca40; }

            .terminal-title {
                flex: 1;
                text-align: center;
                color: #64748b;
                font-size: 0.85rem;
            }

            .terminal-clear {
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 5px 10px;
                border-radius: 5px;
                transition: all 0.3s ease;
            }

            .terminal-clear:hover {
                color: #fff;
                background: rgba(255, 255, 255, 0.1);
            }

            .terminal-output {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                line-height: 1.6;
                color: #e2e8f0;
            }

            .terminal-welcome {
                color: #64748b;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
            }

            .terminal-line {
                margin: 8px 0;
            }

            .terminal-line.command {
                color: #22c55e;
            }

            .terminal-line.command::before {
                content: '$ ';
                color: var(--primary-color, #FFC9D4);
            }

            .terminal-line.output {
                color: #94a3b8;
                padding-left: 20px;
            }

            .terminal-line.error {
                color: #ef4444;
            }

            .terminal-line.success {
                color: #22c55e;
            }

            .terminal-line.info {
                color: #3b82f6;
            }

            .terminal-input-area {
                display: flex;
                align-items: center;
                padding: 12px 15px;
                background: #0f0f15;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                gap: 10px;
            }

            .terminal-prompt {
                color: var(--primary-color, #FFC9D4);
                font-family: 'Courier New', monospace;
                font-weight: bold;
            }

            .terminal-input {
                flex: 1;
                background: transparent;
                border: none;
                color: #fff;
                font-family: 'Courier New', monospace;
                font-size: 0.95rem;
                outline: none;
            }

            .terminal-input::placeholder {
                color: #4a5568;
            }

            .run-command-btn {
                background: var(--primary-color, #FFC9D4);
                color: #000;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.3s ease;
            }

            .run-command-btn:hover {
                background: #fff;
                transform: scale(1.05);
            }

            .suggested-commands {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 12px 15px;
                background: rgba(255, 201, 212, 0.05);
                border-top: 1px solid rgba(255, 255, 255, 0.05);
            }

            .suggested-cmd {
                background: rgba(255, 201, 212, 0.15);
                color: var(--primary-color, #FFC9D4);
                padding: 6px 12px;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid transparent;
            }

            .suggested-cmd:hover {
                background: rgba(255, 201, 212, 0.25);
                border-color: var(--primary-color, #FFC9D4);
            }

            .tutorial-footer {
                padding: 15px 25px;
                background: rgba(255, 201, 212, 0.08);
                border-top: 1px solid rgba(255, 201, 212, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .tutorial-xp-info {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #fbbf24;
            }

            .tutorial-completion {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #22c55e;
                font-size: 1rem;
            }

            .tutorial-completion i {
                font-size: 1.3rem;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .tutorial-body {
                    grid-template-columns: 1fr;
                }

                .tutorial-instruction-panel {
                    border-right: none;
                    border-bottom: 1px solid rgba(255, 201, 212, 0.2);
                    max-height: 40%;
                }

                .tutorial-progress {
                    display: none;
                }

                .tutorial-header {
                    padding: 15px;
                }

                .tutorial-title {
                    font-size: 1.1rem;
                }
            }

            /* Launch Tutorial Button */
            .launch-tutorial-btn {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 12px 24px;
                background: linear-gradient(135deg, var(--primary-color, #FFC9D4), var(--primary-dark, #FFAFBF));
                color: #000;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                font-size: 1rem;
            }

            .launch-tutorial-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(255, 201, 212, 0.4);
            }

            .launch-tutorial-btn i {
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(styles);
    }

    // Tutorial data definitions
    getTutorials() {
        return {
            'node-setup': {
                name: 'Node Setup Tutorial',
                steps: [
                    {
                        title: 'Check System Requirements',
                        description: 'Before setting up your Gensyn node, let\'s verify your system meets the requirements. We\'ll check your GPU and system information.',
                        hints: [
                            'You need at least 32GB RAM for CPU-only mode',
                            'GPU mode requires NVIDIA driver 12.4+',
                            'Supported GPUs: RTX 3090, 4090, A100, H100'
                        ],
                        commands: ['nvidia-smi', 'free -h', 'lscpu']
                    },
                    {
                        title: 'Install Dependencies',
                        description: 'Now we\'ll install the necessary packages. This includes Python, screen for session management, and NVIDIA tools.',
                        hints: [
                            'Run apt-get update first to refresh package lists',
                            'Python 3.10+ is required for Gensyn',
                            'Screen helps keep your node running after disconnect'
                        ],
                        commands: ['sudo apt-get update', 'sudo apt-get install python3.10-venv python3-pip screen -y', 'sudo apt-get install nvidia-cuda-toolkit -y']
                    },
                    {
                        title: 'Clone RL Swarm Repository',
                        description: 'Clone the official RL Swarm repository from Gensyn. This contains all the code needed to run your node.',
                        hints: [
                            'Make sure git is installed on your system',
                            'The repository is regularly updated',
                            'Always check for latest instructions in README'
                        ],
                        commands: ['git clone https://github.com/gensyn-ai/rl-swarm.git', 'cd rl-swarm', 'ls -la']
                    },
                    {
                        title: 'Create Virtual Environment',
                        description: 'Create a Python virtual environment to isolate dependencies. This prevents conflicts with other Python projects.',
                        hints: [
                            'Virtual environments are Python best practice',
                            'Activate the environment before running the node',
                            'You can name the environment anything you like'
                        ],
                        commands: ['python3 -m venv .venv', 'source .venv/bin/activate', 'pip install --upgrade pip']
                    },
                    {
                        title: 'Start Your Node',
                        description: 'Finally, let\'s start your Gensyn node! Use screen to run it in the background so it continues after you disconnect.',
                        hints: [
                            'Use screen -S gensyn to create a named session',
                            'Press Ctrl+A then D to detach from screen',
                            'Use screen -r gensyn to reattach later'
                        ],
                        commands: ['screen -S gensyn', './run_rl_swarm.sh', 'screen -r gensyn']
                    }
                ]
            },
            'wallet-setup': {
                name: 'Wallet Configuration',
                steps: [
                    {
                        title: 'Generate Swarm Key',
                        description: 'Your node needs a unique identity on the Gensyn network. We\'ll generate a swarm key that identifies your node.',
                        hints: [
                            'Keep your swarm key backup safe',
                            'This key is tied to your rewards',
                            'Never share your private key'
                        ],
                        commands: ['cat swarm.pem', 'chmod 600 swarm.pem']
                    },
                    {
                        title: 'Connect External Wallet',
                        description: 'Connect your Ethereum wallet to receive testnet rewards. When the node starts, it will provide a login link.',
                        hints: [
                            'You\'ll see a login URL in the terminal',
                            'Open the URL in your browser',
                            'Sign in with your preferred method'
                        ],
                        commands: ['echo "Watch for login URL in terminal output"', './run_rl_swarm.sh']
                    },
                    {
                        title: 'Verify Connection',
                        description: 'After connecting your wallet, verify that your node is properly registered on the network.',
                        hints: [
                            'Check the Gensyn dashboard for your node',
                            'Your node ID should appear in logs',
                            'Training tasks will be assigned automatically'
                        ],
                        commands: ['tail -f hivemind.log', 'grep "Connected" hivemind.log']
                    }
                ]
            },
            'troubleshooting': {
                name: 'Troubleshooting Guide',
                steps: [
                    {
                        title: 'Check Node Status',
                        description: 'Let\'s check if your node is running properly and identify any issues.',
                        hints: [
                            'Check if the process is running',
                            'Review recent log entries',
                            'Look for error messages'
                        ],
                        commands: ['ps aux | grep rl_swarm', 'tail -100 hivemind.log', 'cat hivemind.log | grep -i error']
                    },
                    {
                        title: 'Fix Common Errors',
                        description: 'Here are solutions to common issues you might encounter.',
                        hints: [
                            'Port conflicts: change swarm port',
                            'Memory issues: use smaller models',
                            'GPU errors: check CUDA version'
                        ],
                        commands: ['free -h', 'nvidia-smi', 'pip list | grep torch']
                    },
                    {
                        title: 'Restart Node',
                        description: 'If issues persist, try restarting your node with a clean state.',
                        hints: [
                            'Kill existing processes first',
                            'Clear cache if needed',
                            'Start fresh with screen'
                        ],
                        commands: ['pkill -f rl_swarm', 'rm -rf __pycache__', 'screen -S gensyn', './run_rl_swarm.sh']
                    }
                ]
            }
        };
    }

    // Simulated command responses
    getCommandResponse(command) {
        const responses = {
            'nvidia-smi': {
                type: 'output',
                text: `+-----------------------------------------------------------------------------+
| NVIDIA-SMI 535.104.05   Driver Version: 535.104.05   CUDA Version: 12.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce RTX 4090  |   00000000:01:00.0  On |                  Off |
|  0%   35C    P8    24W / 450W |    521MiB / 24564MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
|   Processes:                                                                 |
|  GPU   GI   CI        PID   Type   Process name                 GPU Memory |
|        ID   ID                                                  Usage      |
|=============================================================================|
|    0   N/A  N/A      1234      G   /usr/bin/X                       256MiB |
+-----------------------------------------------------------------------------+`
            },
            'free -h': {
                type: 'output',
                text: `              total        used        free      shared  buff/cache   available
Mem:           62Gi       8.2Gi        42Gi       512Mi        12Gi        53Gi
Swap:          8.0Gi          0B       8.0Gi`
            },
            'lscpu': {
                type: 'output',
                text: `Architecture:            x86_64
CPU(s):                  24
Thread(s) per core:      2
Core(s) per socket:      12
Model name:              AMD Ryzen 9 5900X 12-Core Processor
CPU MHz:                 3700.000`
            },
            'sudo apt-get update': {
                type: 'output',
                text: `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]
Get:3 http://archive.ubuntu.com/ubuntu jammy-security InRelease [110 kB]
Fetched 229 kB in 1s (230 kB/s)
Reading package lists... Done`,
                delay: 1500
            },
            'sudo apt-get install python3.10-venv python3-pip screen -y': {
                type: 'success',
                text: `Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  python3.10-venv python3-pip screen
Setting up python3-pip (22.0.2+dfsg-1) ...
Setting up screen (4.9.0-1) ...
Processing triggers for man-db (2.10.2-1) ...`,
                delay: 2000
            },
            'sudo apt-get install nvidia-cuda-toolkit -y': {
                type: 'success',
                text: `Setting up nvidia-cuda-toolkit (12.4.0-1) ...
CUDA toolkit installed successfully.`,
                delay: 1500
            },
            'git clone https://github.com/gensyn-ai/rl-swarm.git': {
                type: 'output',
                text: `Cloning into 'rl-swarm'...
remote: Enumerating objects: 1247, done.
remote: Counting objects: 100% (1247/1247), done.
remote: Compressing objects: 100% (823/823), done.
Receiving objects: 100% (1247/1247), 2.45 MiB | 5.67 MiB/s, done.
Resolving deltas: 100% (678/678), done.`,
                delay: 2000
            },
            'cd rl-swarm': {
                type: 'info',
                text: `Changed directory to ~/rl-swarm`
            },
            'ls -la': {
                type: 'output',
                text: `total 56
drwxrwxr-x  5 user user 4096 Jan 15 10:30 .
drwxr-xr-x 28 user user 4096 Jan 15 10:30 ..
drwxrwxr-x  8 user user 4096 Jan 15 10:30 .git
-rw-rw-r--  1 user user  234 Jan 15 10:30 .gitignore
-rw-rw-r--  1 user user 5678 Jan 15 10:30 README.md
-rwxrwxr-x  1 user user 1234 Jan 15 10:30 run_rl_swarm.sh
drwxrwxr-x  3 user user 4096 Jan 15 10:30 src
-rw-rw-r--  1 user user  456 Jan 15 10:30 requirements.txt`
            },
            'python3 -m venv .venv': {
                type: 'success',
                text: `Creating virtual environment in .venv...
Done.`
            },
            'source .venv/bin/activate': {
                type: 'info',
                text: `(.venv) Virtual environment activated`
            },
            'pip install --upgrade pip': {
                type: 'output',
                text: `Requirement already satisfied: pip in ./.venv/lib/python3.10/site-packages (23.0.1)
Collecting pip
  Downloading pip-24.0-py3-none-any.whl (2.1 MB)
Successfully installed pip-24.0`,
                delay: 1000
            },
            'screen -S gensyn': {
                type: 'info',
                text: `[New screen session: gensyn]
Screen session 'gensyn' created. You're now inside the screen session.`
            },
            './run_rl_swarm.sh': {
                type: 'output',
                text: `🚀 Starting RL Swarm Node...
📦 Loading dependencies...
🔑 Loading swarm key from swarm.pem
🌐 Connecting to Gensyn network...
✅ Connected to swarm!
📊 Node ID: 0x7a3b...9f2e
🎓 Ready to receive training tasks
⏳ Waiting for task assignment...`,
                delay: 2500
            },
            'screen -r gensyn': {
                type: 'info',
                text: `Reattaching to screen session 'gensyn'...`
            },
            'cat swarm.pem': {
                type: 'output',
                text: `-----BEGIN EC PRIVATE KEY-----
[Your private key content - NEVER SHARE THIS]
-----END EC PRIVATE KEY-----

Note: Keep this file secure. It's your node's identity.`
            },
            'chmod 600 swarm.pem': {
                type: 'success',
                text: `Permissions set to 600 (read/write owner only)`
            },
            'tail -f hivemind.log': {
                type: 'output',
                text: `[2024-01-15 10:45:32] INFO: Training batch 1247 completed
[2024-01-15 10:45:35] INFO: Gradient uploaded successfully
[2024-01-15 10:45:38] INFO: Received new training task
[2024-01-15 10:45:40] INFO: Processing task_id=abc123...`
            },
            'grep "Connected" hivemind.log': {
                type: 'success',
                text: `[2024-01-15 10:30:15] INFO: Connected to Gensyn swarm network
[2024-01-15 10:30:16] INFO: Connected peers: 47`
            },
            'ps aux | grep rl_swarm': {
                type: 'output',
                text: `user     12345  0.5  2.1 4523456 876543 ?   Sl   10:30   0:45 python3 rl_swarm.py
user     12346  0.0  0.0   8940   720 pts/0  S+   10:45   0:00 grep rl_swarm`
            },
            'tail -100 hivemind.log': {
                type: 'output',
                text: `[2024-01-15 10:40:00] INFO: Health check passed
[2024-01-15 10:41:00] INFO: Training batch 1240 completed
[2024-01-15 10:42:00] INFO: Gradient averaging in progress
[2024-01-15 10:43:00] INFO: New model weights received
[2024-01-15 10:44:00] INFO: Training batch 1245 started`
            },
            'cat hivemind.log | grep -i error': {
                type: 'success',
                text: `No errors found in recent logs ✅`
            },
            'pip list | grep torch': {
                type: 'output',
                text: `torch                   2.1.0+cu121
torchaudio              2.1.0+cu121
torchvision             0.16.0+cu121`
            },
            'pkill -f rl_swarm': {
                type: 'success',
                text: `Process terminated.`
            },
            'rm -rf __pycache__': {
                type: 'success',
                text: `Cache cleared.`
            },
            'echo "Watch for login URL in terminal output"': {
                type: 'info',
                text: `Watch for login URL in terminal output`
            }
        };

        // Check for exact match
        if (responses[command]) {
            return responses[command];
        }

        // Check for partial matches
        for (const [cmd, response] of Object.entries(responses)) {
            if (command.includes(cmd) || cmd.includes(command)) {
                return response;
            }
        }

        // Default response for unknown commands
        return {
            type: 'output',
            text: `Simulated output for: ${command}\n(This is a tutorial simulation - actual output may vary)`
        };
    }

    // Open tutorial
    startTutorial(tutorialId) {
        const tutorials = this.getTutorials();
        if (!tutorials[tutorialId]) {
            console.error('Tutorial not found:', tutorialId);
            return;
        }

        this.tutorialData = tutorials[tutorialId];
        this.currentStep = 0;
        this.isRunning = true;
        this.terminalHistory = [];

        const modal = document.getElementById('tutorial-modal');
        modal.classList.add('active');

        this.renderStep();
        this.clearTerminal();

        // Track tutorial start
        if (window.HippocampAnalytics) {
            window.HippocampAnalytics.trackEvent('tutorial_started', { tutorial: tutorialId });
        }
    }

    closeTutorial() {
        const modal = document.getElementById('tutorial-modal');
        modal.classList.remove('active');
        this.isRunning = false;
    }

    renderStep() {
        const step = this.tutorialData.steps[this.currentStep];
        const totalSteps = this.tutorialData.steps.length;

        // Update header
        document.getElementById('tutorial-name').textContent = this.tutorialData.name;
        document.getElementById('tutorial-step-info').textContent = `Step ${this.currentStep + 1} of ${totalSteps}`;
        document.getElementById('tutorial-progress-fill').style.width = `${((this.currentStep + 1) / totalSteps) * 100}%`;

        // Update content
        document.getElementById('step-title').textContent = step.title;
        document.getElementById('step-description').textContent = step.description;

        // Render hints
        const hintsContainer = document.getElementById('step-hints');
        if (step.hints && step.hints.length > 0) {
            hintsContainer.innerHTML = `
                <h4><i class="fas fa-lightbulb"></i> Tips</h4>
                <ul>
                    ${step.hints.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
            `;
        } else {
            hintsContainer.innerHTML = '';
        }

        // Update suggested commands
        const suggestedContainer = document.getElementById('suggested-commands');
        if (step.commands && step.commands.length > 0) {
            suggestedContainer.innerHTML = step.commands.map(cmd => 
                `<span class="suggested-cmd" onclick="window.interactiveTutorial.useCommand('${cmd.replace(/'/g, "\\'")}')">${cmd}</span>`
            ).join('');
        } else {
            suggestedContainer.innerHTML = '';
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('prev-step-btn');
        const nextBtn = document.getElementById('next-step-btn');
        
        prevBtn.disabled = this.currentStep === 0;
        
        if (this.currentStep === totalSteps - 1) {
            nextBtn.innerHTML = '<i class="fas fa-check"></i> Complete';
            nextBtn.onclick = () => this.completeTutorial();
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
            nextBtn.onclick = () => this.nextStep();
        }
    }

    nextStep() {
        if (this.currentStep < this.tutorialData.steps.length - 1) {
            this.currentStep++;
            this.renderStep();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
        }
    }

    completeTutorial() {
        // Show completion
        document.getElementById('tutorial-xp-info').style.display = 'none';
        document.getElementById('tutorial-completion').style.display = 'flex';

        // Award XP
        if (window.HippocampUser) {
            window.HippocampUser.addXP(50, 'Tutorial Completed');
        }

        // Track completion
        if (window.HippocampAnalytics) {
            window.HippocampAnalytics.trackEvent('tutorial_completed', { tutorial: this.tutorialData.name });
        }

        // Show confetti effect in terminal
        this.addTerminalLine('🎉 Congratulations! Tutorial completed!', 'success');
        this.addTerminalLine('✨ You earned 50 XP!', 'success');

        // Close after delay
        setTimeout(() => {
            this.closeTutorial();
            
            // Reset for next time
            document.getElementById('tutorial-xp-info').style.display = 'flex';
            document.getElementById('tutorial-completion').style.display = 'none';
        }, 3000);
    }

    useCommand(command) {
        document.getElementById('terminal-input').value = command;
        document.getElementById('terminal-input').focus();
    }

    runCommand() {
        const input = document.getElementById('terminal-input');
        const command = input.value.trim();
        
        if (!command) return;

        // Add command to terminal
        this.addTerminalLine(command, 'command');
        input.value = '';

        // Get simulated response
        const response = this.getCommandResponse(command);
        const delay = response.delay || 500;

        // Simulate processing
        setTimeout(() => {
            this.addTerminalLine(response.text, response.type);
            this.scrollTerminalToBottom();
        }, delay);
    }

    addTerminalLine(text, type = 'output') {
        const output = document.getElementById('terminal-output');
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = text.replace(/\n/g, '<br>');
        output.appendChild(line);
        this.scrollTerminalToBottom();
        this.terminalHistory.push({ text, type });
    }

    clearTerminal() {
        const output = document.getElementById('terminal-output');
        output.innerHTML = `
            <div class="terminal-welcome">
                Welcome to the Interactive Tutorial Terminal<br>
                Type commands below or click suggested commands to simulate execution.
            </div>
        `;
        this.terminalHistory = [];
    }

    scrollTerminalToBottom() {
        const output = document.getElementById('terminal-output');
        output.scrollTop = output.scrollHeight;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveTutorial = new InteractiveTutorial();
});

// Global function to start tutorials from anywhere
function startTutorial(tutorialId) {
    if (window.interactiveTutorial) {
        window.interactiveTutorial.startTutorial(tutorialId);
    }
}

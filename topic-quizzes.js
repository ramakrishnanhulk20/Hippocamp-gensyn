// Hippocamp Academy - Topic Quizzes
// Individual quizzes for each research paper and topic

const TOPIC_QUIZZES = {
    sapo: {
        id: 'sapo',
        name: 'SAPO Deep Dive',
        description: 'Test your knowledge of Selective Activation of Policy Optimization',
        icon: '🎯',
        difficulty: 'hard',
        questions: [
            {
                question: "What does SAPO stand for?",
                options: [
                    "Selective Activation of Policy Optimization",
                    "Sequential Adaptive Policy Ordering",
                    "Stochastic Alignment for Policy Operations",
                    "Scaled Attention for Parameter Optimization"
                ],
                correct: 0,
                explanation: "SAPO stands for Selective Activation of Policy Optimization - a meta-algorithm for efficient LM post-training."
            },
            {
                question: "What type of algorithm does SAPO wrap around?",
                options: [
                    "Policy gradient algorithms",
                    "Supervised learning algorithms",
                    "Unsupervised clustering algorithms",
                    "Genetic algorithms"
                ],
                correct: 0,
                explanation: "SAPO is a meta-algorithm that wraps around policy gradient algorithms for more efficient training."
            },
            {
                question: "What is the primary benefit of selective activation in SAPO?",
                options: [
                    "Applying updates only when they provide meaningful improvements",
                    "Reducing model size through pruning",
                    "Increasing training data diversity",
                    "Enabling faster inference speeds"
                ],
                correct: 0,
                explanation: "Selective activation means applying policy gradient updates only when they provide meaningful improvements based on advantage estimates."
            },
            {
                question: "SAPO is particularly useful for which type of model training?",
                options: [
                    "Language model post-training with collective RL",
                    "Computer vision pre-training",
                    "Speech recognition fine-tuning",
                    "Recommendation system training"
                ],
                correct: 0,
                explanation: "SAPO is designed for efficient language model post-training using collective reinforcement learning."
            },
            {
                question: "What advantage estimates does SAPO use to decide on updates?",
                options: [
                    "Reward-based advantage estimates comparing actions to baseline",
                    "Gradient magnitude thresholds",
                    "Loss function convergence rates",
                    "Random sampling decisions"
                ],
                correct: 0,
                explanation: "SAPO uses advantage estimates that compare the expected reward of actions against a baseline to selectively activate updates."
            }
        ]
    },
    
    checkfree: {
        id: 'checkfree',
        name: 'CheckFree Mastery',
        description: 'Master fault tolerance in distributed training',
        icon: '🛡️',
        difficulty: 'hard',
        questions: [
            {
                question: "What problem does CheckFree solve?",
                options: [
                    "Fault tolerance without checkpointing in distributed training",
                    "Payment processing for compute resources",
                    "Memory optimization in large models",
                    "Network latency reduction"
                ],
                correct: 0,
                explanation: "CheckFree provides fault tolerance for distributed training without requiring checkpointing or redundant computation."
            },
            {
                question: "How does CheckFree recover from worker failures?",
                options: [
                    "Reconstructing lost gradients from remaining workers using gradient algebra",
                    "Replaying the entire training batch from scratch",
                    "Loading the last saved checkpoint",
                    "Using redundant worker copies"
                ],
                correct: 0,
                explanation: "CheckFree uses gradient algebra to reconstruct lost gradients from the remaining workers, avoiding checkpointing overhead."
            },
            {
                question: "What is the main advantage of CheckFree over traditional checkpointing?",
                options: [
                    "Eliminates storage and I/O overhead of saving model states",
                    "Provides faster model inference",
                    "Reduces memory usage during forward pass",
                    "Improves model accuracy"
                ],
                correct: 0,
                explanation: "CheckFree eliminates the storage and I/O overhead associated with periodically saving model checkpoints."
            },
            {
                question: "CheckFree is particularly valuable in which environment?",
                options: [
                    "Heterogeneous networks with unreliable nodes",
                    "Single-GPU training setups",
                    "Highly reliable data center environments",
                    "Edge device inference"
                ],
                correct: 0,
                explanation: "CheckFree is especially valuable in heterogeneous, decentralized networks where node failures are more common."
            },
            {
                question: "What mathematical concept enables CheckFree's gradient reconstruction?",
                options: [
                    "Linear algebra properties of gradient aggregation",
                    "Fourier transforms",
                    "Bayesian inference",
                    "Monte Carlo sampling"
                ],
                correct: 0,
                explanation: "CheckFree leverages linear algebra properties of gradient aggregation to reconstruct lost gradients from remaining data."
            }
        ]
    },
    
    noloco: {
        id: 'noloco',
        name: 'NoLoCo Challenge',
        description: 'Understand gossip-based distributed training',
        icon: '💬',
        difficulty: 'hard',
        questions: [
            {
                question: "What does NoLoCo stand for?",
                options: [
                    "No Local Communication (eliminating all-reduce)",
                    "Non-Local Computation",
                    "Normalized Loss Convergence",
                    "Node Location Coordination"
                ],
                correct: 0,
                explanation: "NoLoCo stands for No Local Communication, referring to its elimination of global all-reduce operations."
            },
            {
                question: "What communication pattern does NoLoCo replace?",
                options: [
                    "All-reduce synchronization with gossip-based exchange",
                    "Point-to-point with broadcast",
                    "Ring topology with star topology",
                    "Synchronous with asynchronous batching"
                ],
                correct: 0,
                explanation: "NoLoCo replaces global all-reduce synchronization with gossip-based gradient exchange among neighbors."
            },
            {
                question: "Why is all-reduce problematic in decentralized networks?",
                options: [
                    "It creates a synchronization bottleneck with heterogeneous nodes",
                    "It uses too much memory",
                    "It requires specialized hardware",
                    "It only works with small models"
                ],
                correct: 0,
                explanation: "All-reduce creates synchronization bottlenecks because all nodes must wait for the slowest node in heterogeneous networks."
            },
            {
                question: "How do nodes share gradients in NoLoCo?",
                options: [
                    "Exchanging with random neighbors in a gossip pattern",
                    "Broadcasting to all nodes simultaneously",
                    "Sending to a central parameter server",
                    "Using a fixed ring topology"
                ],
                correct: 0,
                explanation: "In NoLoCo, nodes exchange gradients with random neighbors in a gossip pattern, allowing information to spread without global synchronization."
            },
            {
                question: "What type of network topology works best with NoLoCo?",
                options: [
                    "Decentralized heterogeneous networks with varying connection speeds",
                    "Homogeneous data center clusters",
                    "Single-machine multi-GPU setups",
                    "Star topology with central coordinator"
                ],
                correct: 0,
                explanation: "NoLoCo excels in decentralized, heterogeneous networks where connection speeds vary and global synchronization is impractical."
            }
        ]
    },
    
    skippipe: {
        id: 'skippipe',
        name: 'SkipPipe Expert',
        description: 'Master pipeline parallelism optimization',
        icon: '⚡',
        difficulty: 'hard',
        questions: [
            {
                question: "What is SkipPipe's main optimization technique?",
                options: [
                    "Strategically skipping backward pass communications",
                    "Skipping layers during forward pass",
                    "Bypassing activation checkpointing",
                    "Omitting certain training epochs"
                ],
                correct: 0,
                explanation: "SkipPipe strategically skips certain backward pass communications for micro-batches to reduce bandwidth requirements."
            },
            {
                question: "What type of parallelism does SkipPipe enhance?",
                options: [
                    "Pipeline parallelism",
                    "Data parallelism",
                    "Tensor parallelism",
                    "Expert parallelism"
                ],
                correct: 0,
                explanation: "SkipPipe specifically enhances pipeline parallelism, where different layers are distributed across devices."
            },
            {
                question: "What resource does SkipPipe primarily optimize?",
                options: [
                    "Network bandwidth in heterogeneous networks",
                    "GPU memory usage",
                    "CPU computation time",
                    "Storage space for checkpoints"
                ],
                correct: 0,
                explanation: "SkipPipe primarily optimizes network bandwidth usage, which is crucial in heterogeneous networks with varying connection speeds."
            },
            {
                question: "How does SkipPipe maintain model quality while skipping communications?",
                options: [
                    "By carefully selecting which micro-batches can safely skip updates",
                    "By using approximate gradients",
                    "By increasing the learning rate",
                    "By training for more epochs"
                ],
                correct: 0,
                explanation: "SkipPipe maintains quality by carefully analyzing which micro-batches can safely skip communications without significantly impacting convergence."
            },
            {
                question: "SkipPipe is crucial for making what type of training practical?",
                options: [
                    "Decentralized training with varying connection speeds",
                    "Single-GPU training of large models",
                    "Inference optimization",
                    "Transfer learning from pre-trained models"
                ],
                correct: 0,
                explanation: "SkipPipe is crucial for making decentralized training practical in networks where connection speeds vary significantly."
            }
        ]
    },
    
    verde: {
        id: 'verde',
        name: 'Verde Verification',
        description: 'Learn cryptographic verification of ML computations',
        icon: '🔐',
        difficulty: 'hard',
        questions: [
            {
                question: "What type of verification does Verde use?",
                options: [
                    "Probabilistic verification with zero-knowledge proofs",
                    "Full re-computation on trusted nodes",
                    "Majority voting among participants",
                    "Hash-based verification of outputs"
                ],
                correct: 0,
                explanation: "Verde uses probabilistic verification combined with zero-knowledge cryptographic proofs for efficient ML verification."
            },
            {
                question: "Why is Verde more efficient than full re-computation?",
                options: [
                    "It uses statistical sampling instead of verifying every computation",
                    "It runs on faster hardware",
                    "It uses compressed models",
                    "It skips verification entirely"
                ],
                correct: 0,
                explanation: "Verde is orders of magnitude more efficient because it uses statistical sampling rather than re-running all computations."
            },
            {
                question: "What cryptographic technique does Verde employ?",
                options: [
                    "Zero-knowledge proofs for gradient verification",
                    "RSA encryption for data protection",
                    "Merkle trees for state verification",
                    "Digital signatures for authentication"
                ],
                correct: 0,
                explanation: "Verde employs zero-knowledge proofs to verify gradient computations without revealing the underlying data or computation details."
            },
            {
                question: "Verde ensures correctness over what type of nodes?",
                options: [
                    "Untrusted nodes in a permissionless network",
                    "Only pre-approved validator nodes",
                    "Nodes with specialized secure hardware",
                    "Centralized cloud provider nodes"
                ],
                correct: 0,
                explanation: "Verde is designed to verify ML computations done on untrusted nodes in a permissionless, decentralized network."
            },
            {
                question: "What is the tradeoff Verde makes for efficiency?",
                options: [
                    "Probabilistic guarantees instead of deterministic verification",
                    "Lower model accuracy",
                    "Slower training speed",
                    "Higher memory requirements"
                ],
                correct: 0,
                explanation: "Verde trades deterministic verification for probabilistic guarantees, providing strong but not absolute certainty about computation correctness."
            }
        ]
    },
    
    rlswarm: {
        id: 'rlswarm',
        name: 'RL Swarm Specialist',
        description: 'Become an expert in swarm intelligence for AI',
        icon: '🤖',
        difficulty: 'medium',
        questions: [
            {
                question: "What is RL Swarm?",
                options: [
                    "A peer-to-peer reinforcement learning system for collaborative training",
                    "A single-agent reinforcement learning framework",
                    "A data labeling platform",
                    "A model deployment service"
                ],
                correct: 0,
                explanation: "RL Swarm is a peer-to-peer system where multiple AI models train collaboratively using reinforcement learning."
            },
            {
                question: "How do agents share experiences in RL Swarm?",
                options: [
                    "Through distributed replay buffers with prioritized sampling",
                    "By directly copying model weights",
                    "Using a centralized experience database",
                    "Through periodic model snapshots"
                ],
                correct: 0,
                explanation: "RL Swarm agents share experiences through distributed replay buffers with prioritized sampling across peers."
            },
            {
                question: "What is the main benefit of swarm-based learning?",
                options: [
                    "Agents learn from collective experiences across the network",
                    "Training is faster on a single machine",
                    "Models require less memory",
                    "Data preprocessing is automated"
                ],
                correct: 0,
                explanation: "Swarm-based learning allows agents to benefit from collective experiences, accelerating learning beyond what any single agent could achieve."
            },
            {
                question: "What game does BlockAssist demonstrate RL Swarm capabilities in?",
                options: [
                    "Minecraft",
                    "Chess",
                    "Go",
                    "StarCraft"
                ],
                correct: 0,
                explanation: "BlockAssist is an AI Minecraft assistant that demonstrates RL Swarm's capabilities in interactive gaming environments."
            },
            {
                question: "What makes RL Swarm suitable for decentralized networks?",
                options: [
                    "It doesn't require centralized coordination for learning",
                    "It only works with small models",
                    "It requires specialized hardware",
                    "It needs constant internet connectivity"
                ],
                correct: 0,
                explanation: "RL Swarm is designed for decentralized operation, allowing agents to learn collaboratively without centralized coordination."
            }
        ]
    }
};

// Quiz UI and Logic
class TopicQuiz {
    constructor(quizId) {
        this.quizData = TOPIC_QUIZZES[quizId];
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.startTime = null;
    }
    
    start() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.startTime = Date.now();
        return this.quizData.questions[0];
    }
    
    answer(selectedIndex) {
        const question = this.quizData.questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        if (isCorrect) this.score++;
        
        this.answers.push({
            questionIndex: this.currentQuestion,
            selected: selectedIndex,
            correct: question.correct,
            isCorrect
        });
        
        return {
            isCorrect,
            correctIndex: question.correct,
            explanation: question.explanation
        };
    }
    
    next() {
        this.currentQuestion++;
        if (this.currentQuestion < this.quizData.questions.length) {
            return this.quizData.questions[this.currentQuestion];
        }
        return null;
    }
    
    getResults() {
        const timeTaken = Math.round((Date.now() - this.startTime) / 1000);
        return {
            quizId: this.quizData.id,
            quizName: this.quizData.name,
            score: this.score,
            total: this.quizData.questions.length,
            percentage: Math.round((this.score / this.quizData.questions.length) * 100),
            timeTaken,
            answers: this.answers
        };
    }
}

// Expose to window
window.TOPIC_QUIZZES = TOPIC_QUIZZES;
window.TopicQuiz = TopicQuiz;

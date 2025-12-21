import { AptitudeQuestion } from './aptitude-questions'

// ==================== DATA SCIENCE ====================
export const dataScienceQuestions: AptitudeQuestion[] = [
  {
    id: "ds-001",
    category: "quantitative",
    difficulty: "easy",
    topic: "statistics-basics",
    question: "What is the mean of the dataset: 2, 4, 6, 8, 10?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    explanation: "Mean = (2+4+6+8+10)/5 = 30/5 = 6"
  },
  {
    id: "ds-002",
    category: "quantitative",
    difficulty: "medium",
    topic: "probability",
    question: "What is the probability of getting exactly 2 heads when flipping a fair coin 3 times?",
    options: ["1/8", "1/4", "3/8", "1/2"],
    correctAnswer: 2,
    explanation: "Possible outcomes: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT. Exactly 2 heads: HHT, HTH, THH = 3/8"
  },
  {
    id: "ds-003",
    category: "logical",
    difficulty: "medium",
    topic: "data-analysis",
    question: "Which measure of central tendency is most affected by outliers?",
    options: ["Mean", "Median", "Mode", "Range"],
    correctAnswer: 0,
    explanation: "Mean is most affected by outliers as it uses all values in calculation, while median only considers middle values"
  },
  {
    id: "ds-004",
    category: "quantitative",
    difficulty: "hard",
    topic: "python-basics",
    question: "In pandas, which method is used to handle missing values by removing rows?",
    options: ["fillna()", "dropna()", "isnull()", "remove()"],
    correctAnswer: 1,
    explanation: "dropna() removes rows or columns with missing values in pandas DataFrames"
  },
  {
    id: "ds-005",
    category: "logical",
    difficulty: "medium",
    topic: "sql",
    question: "Which SQL clause is used to filter groups created by GROUP BY?",
    options: ["WHERE", "HAVING", "FILTER", "SELECT"],
    correctAnswer: 1,
    explanation: "HAVING is used to filter aggregated results after GROUP BY, while WHERE filters before grouping"
  },
  {
    id: "ds-006",
    category: "quantitative",
    difficulty: "hard",
    topic: "machine-learning",
    question: "What is the purpose of train-test split in machine learning?",
    options: ["To make training faster", "To evaluate model performance on unseen data", "To reduce overfitting during training", "To balance the dataset"],
    correctAnswer: 1,
    explanation: "Train-test split separates data to evaluate how well the model generalizes to new, unseen data"
  },
  {
    id: "ds-007",
    category: "logical",
    difficulty: "easy",
    topic: "data-types",
    question: "Which data type is best suited for storing categorical variables with order?",
    options: ["Nominal", "Ordinal", "Interval", "Ratio"],
    correctAnswer: 1,
    explanation: "Ordinal data represents categories with a meaningful order (e.g., Low, Medium, High)"
  },
  {
    id: "ds-008",
    category: "quantitative",
    difficulty: "medium",
    topic: "statistics",
    question: "If standard deviation is 4, what is the variance?",
    options: ["2", "4", "8", "16"],
    correctAnswer: 3,
    explanation: "Variance = (Standard Deviation)² = 4² = 16"
  },
  {
    id: "ds-009",
    category: "logical",
    difficulty: "hard",
    topic: "correlation",
    question: "A correlation coefficient of -0.85 indicates:",
    options: ["Strong positive relationship", "Weak negative relationship", "Strong negative relationship", "No relationship"],
    correctAnswer: 2,
    explanation: "Values close to -1 indicate strong negative correlation, meaning as one variable increases, the other decreases"
  },
  {
    id: "ds-010",
    category: "quantitative",
    difficulty: "medium",
    topic: "visualization",
    question: "Which chart type is best for showing the distribution of a continuous variable?",
    options: ["Bar chart", "Histogram", "Pie chart", "Line chart"],
    correctAnswer: 1,
    explanation: "Histograms display the frequency distribution of continuous numerical data"
  },
  {
    id: "ds-011",
    category: "logical",
    difficulty: "easy",
    topic: "numpy",
    question: "In NumPy, what does the reshape() function do?",
    options: ["Changes array values", "Changes array dimensions", "Sorts the array", "Filters the array"],
    correctAnswer: 1,
    explanation: "reshape() changes the dimensions of an array without changing its data"
  },
  {
    id: "ds-012",
    category: "quantitative",
    difficulty: "hard",
    topic: "hypothesis-testing",
    question: "What does a p-value of 0.03 indicate at a 5% significance level?",
    options: ["Accept null hypothesis", "Reject null hypothesis", "Inconclusive", "Error in calculation"],
    correctAnswer: 1,
    explanation: "P-value (0.03) < significance level (0.05), so we reject the null hypothesis"
  },
  {
    id: "ds-013",
    category: "logical",
    difficulty: "medium",
    topic: "data-cleaning",
    question: "What is the purpose of normalization in data preprocessing?",
    options: ["Remove duplicates", "Scale features to similar ranges", "Handle missing values", "Detect outliers"],
    correctAnswer: 1,
    explanation: "Normalization scales numerical features to a common range (e.g., 0-1) to prevent bias from different scales"
  },
  {
    id: "ds-014",
    category: "quantitative",
    difficulty: "medium",
    topic: "regression",
    question: "In linear regression, what does R² measure?",
    options: ["Error rate", "Variance explained by model", "Correlation", "Sample size"],
    correctAnswer: 1,
    explanation: "R² (coefficient of determination) measures the proportion of variance in the dependent variable explained by the model"
  },
  {
    id: "ds-015",
    category: "logical",
    difficulty: "hard",
    topic: "time-series",
    question: "Which component is NOT part of time series decomposition?",
    options: ["Trend", "Seasonality", "Residual", "Correlation"],
    correctAnswer: 3,
    explanation: "Time series decomposition includes Trend, Seasonality, and Residual (noise). Correlation is not a component"
  }
]

// ==================== WEB DEVELOPMENT ====================
export const webDevelopmentQuestions: AptitudeQuestion[] = [
  {
    id: "web-001",
    category: "logical",
    difficulty: "easy",
    topic: "html-basics",
    question: "Which HTML tag is used for creating a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1,
    explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML"
  },
  {
    id: "web-002",
    category: "logical",
    difficulty: "easy",
    topic: "css-basics",
    question: "Which CSS property is used to change text color?",
    options: ["text-color", "color", "font-color", "text-style"],
    correctAnswer: 1,
    explanation: "The 'color' property in CSS is used to change text color"
  },
  {
    id: "web-003",
    category: "logical",
    difficulty: "medium",
    topic: "javascript",
    question: "What is the output of: typeof null?",
    options: ["'null'", "'undefined'", "'object'", "'number'"],
    correctAnswer: 2,
    explanation: "typeof null returns 'object' - this is a known JavaScript quirk/bug that persists for backward compatibility"
  },
  {
    id: "web-004",
    category: "logical",
    difficulty: "medium",
    topic: "responsive-design",
    question: "Which CSS unit is relative to the viewport width?",
    options: ["px", "em", "vw", "rem"],
    correctAnswer: 2,
    explanation: "vw (viewport width) is a CSS unit where 1vw = 1% of viewport width"
  },
  {
    id: "web-005",
    category: "logical",
    difficulty: "hard",
    topic: "javascript-async",
    question: "What does async/await help with in JavaScript?",
    options: ["Faster code execution", "Handling asynchronous operations", "Type checking", "Memory management"],
    correctAnswer: 1,
    explanation: "async/await syntax makes asynchronous code look and behave more like synchronous code"
  },
  {
    id: "web-006",
    category: "logical",
    difficulty: "easy",
    topic: "dom",
    question: "Which method is used to select an element by ID in JavaScript?",
    options: ["getElement()", "getElementById()", "querySelector()", "selectById()"],
    correctAnswer: 1,
    explanation: "document.getElementById() selects an element by its ID attribute"
  },
  {
    id: "web-007",
    category: "logical",
    difficulty: "medium",
    topic: "rest-api",
    question: "Which HTTP method is used to update existing data?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswer: 2,
    explanation: "PUT is used to update existing resources in REST APIs"
  },
  {
    id: "web-008",
    category: "logical",
    difficulty: "hard",
    topic: "react",
    question: "What is the purpose of useEffect in React?",
    options: ["State management", "Side effects handling", "Event handling", "Routing"],
    correctAnswer: 1,
    explanation: "useEffect handles side effects like data fetching, subscriptions, and DOM manipulation in React"
  },
  {
    id: "web-009",
    category: "logical",
    difficulty: "medium",
    topic: "css-flexbox",
    question: "Which CSS property defines the direction of flex items?",
    options: ["flex-direction", "flex-flow", "direction", "align-items"],
    correctAnswer: 0,
    explanation: "flex-direction sets the main axis direction for flex items (row, column, etc.)"
  },
  {
    id: "web-010",
    category: "logical",
    difficulty: "easy",
    topic: "version-control",
    question: "What does 'git pull' do?",
    options: ["Push changes to remote", "Fetch and merge changes from remote", "Create a branch", "Delete a branch"],
    correctAnswer: 1,
    explanation: "git pull fetches changes from remote repository and merges them into current branch"
  },
  {
    id: "web-011",
    category: "logical",
    difficulty: "hard",
    topic: "security",
    question: "What is CORS in web development?",
    options: ["A database", "Cross-Origin Resource Sharing", "A JavaScript framework", "A CSS property"],
    correctAnswer: 1,
    explanation: "CORS is a security mechanism that allows or restricts web pages from making requests to different domains"
  },
  {
    id: "web-012",
    category: "logical",
    difficulty: "medium",
    topic: "nodejs",
    question: "What is the purpose of package.json in Node.js?",
    options: ["Store code", "Manage dependencies and metadata", "Configure database", "Define routes"],
    correctAnswer: 1,
    explanation: "package.json contains project metadata and manages dependencies in Node.js projects"
  },
  {
    id: "web-013",
    category: "logical",
    difficulty: "easy",
    topic: "http",
    question: "What does HTTP status code 404 represent?",
    options: ["Success", "Server error", "Not found", "Unauthorized"],
    correctAnswer: 2,
    explanation: "404 indicates the requested resource was not found on the server"
  },
  {
    id: "web-014",
    category: "logical",
    difficulty: "hard",
    topic: "performance",
    question: "What is lazy loading in web development?",
    options: ["Slow internet connection", "Deferring loading of non-critical resources", "A JavaScript library", "A CSS technique"],
    correctAnswer: 1,
    explanation: "Lazy loading defers loading of resources until they're needed, improving initial page load time"
  },
  {
    id: "web-015",
    category: "logical",
    difficulty: "medium",
    topic: "local-storage",
    question: "What is the maximum storage limit for localStorage in most browsers?",
    options: ["1MB", "5MB", "10MB", "50MB"],
    correctAnswer: 1,
    explanation: "Most browsers allow approximately 5MB of localStorage per domain"
  }
]

// ==================== CYBERSECURITY ====================
export const cybersecurityQuestions: AptitudeQuestion[] = [
  {
    id: "cyber-001",
    category: "logical",
    difficulty: "easy",
    topic: "security-basics",
    question: "What does CIA stand for in cybersecurity?",
    options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Computer Internet Access", "Cybersecurity Information Act"],
    correctAnswer: 1,
    explanation: "CIA triad represents the three core principles of information security: Confidentiality, Integrity, and Availability"
  },
  {
    id: "cyber-002",
    category: "logical",
    difficulty: "medium",
    topic: "encryption",
    question: "What type of encryption uses the same key for encryption and decryption?",
    options: ["Asymmetric", "Symmetric", "Hashing", "Public key"],
    correctAnswer: 1,
    explanation: "Symmetric encryption uses the same key for both encryption and decryption (e.g., AES, DES)"
  },
  {
    id: "cyber-003",
    category: "logical",
    difficulty: "easy",
    topic: "malware",
    question: "What is malware that replicates itself without human intervention?",
    options: ["Virus", "Worm", "Trojan", "Spyware"],
    correctAnswer: 1,
    explanation: "A worm is self-replicating malware that spreads automatically without human intervention"
  },
  {
    id: "cyber-004",
    category: "logical",
    difficulty: "hard",
    topic: "network-security",
    question: "Which port does HTTPS typically use?",
    options: ["80", "443", "8080", "22"],
    correctAnswer: 1,
    explanation: "HTTPS uses port 443 by default, while HTTP uses port 80"
  },
  {
    id: "cyber-005",
    category: "logical",
    difficulty: "medium",
    topic: "attacks",
    question: "What type of attack floods a network with traffic to make it unavailable?",
    options: ["Phishing", "DDoS", "SQL Injection", "Man-in-the-Middle"],
    correctAnswer: 1,
    explanation: "DDoS (Distributed Denial of Service) floods systems with traffic to make them unavailable"
  },
  {
    id: "cyber-006",
    category: "logical",
    difficulty: "easy",
    topic: "authentication",
    question: "What does MFA stand for?",
    options: ["Multiple File Access", "Multi-Factor Authentication", "Main Function Authority", "Manual Firewall Activation"],
    correctAnswer: 1,
    explanation: "MFA (Multi-Factor Authentication) requires multiple verification methods to access an account"
  },
  {
    id: "cyber-007",
    category: "logical",
    difficulty: "hard",
    topic: "cryptography",
    question: "What is a hash function used for in security?",
    options: ["Encrypting data", "Creating one-way fingerprints of data", "Compressing files", "Generating passwords"],
    correctAnswer: 1,
    explanation: "Hash functions create fixed-size, one-way fingerprints of data for integrity verification"
  },
  {
    id: "cyber-008",
    category: "logical",
    difficulty: "medium",
    topic: "firewall",
    question: "What is the primary purpose of a firewall?",
    options: ["Encrypt data", "Control network traffic", "Scan for viruses", "Back up data"],
    correctAnswer: 1,
    explanation: "Firewalls monitor and control incoming and outgoing network traffic based on security rules"
  },
  {
    id: "cyber-009",
    category: "logical",
    difficulty: "easy",
    topic: "social-engineering",
    question: "What is phishing?",
    options: ["A type of malware", "Fraudulent attempt to obtain sensitive information", "Network scanning", "Password cracking"],
    correctAnswer: 1,
    explanation: "Phishing is a social engineering attack that tricks users into revealing sensitive information"
  },
  {
    id: "cyber-010",
    category: "logical",
    difficulty: "hard",
    topic: "penetration-testing",
    question: "What is the first phase of penetration testing?",
    options: ["Exploitation", "Reconnaissance", "Reporting", "Privilege escalation"],
    correctAnswer: 1,
    explanation: "Reconnaissance (information gathering) is the first phase of penetration testing"
  },
  {
    id: "cyber-011",
    category: "logical",
    difficulty: "medium",
    topic: "vpn",
    question: "What does VPN provide?",
    options: ["Faster internet", "Encrypted tunnel for data transmission", "Antivirus protection", "File storage"],
    correctAnswer: 1,
    explanation: "VPN (Virtual Private Network) creates an encrypted tunnel for secure data transmission"
  },
  {
    id: "cyber-012",
    category: "logical",
    difficulty: "easy",
    topic: "passwords",
    question: "Which is the strongest password?",
    options: ["password123", "Password", "P@ssw0rd!2024#Xy", "12345678"],
    correctAnswer: 2,
    explanation: "Strong passwords combine uppercase, lowercase, numbers, symbols, and are lengthy"
  },
  {
    id: "cyber-013",
    category: "logical",
    difficulty: "hard",
    topic: "sql-injection",
    question: "What can SQL injection attack do?",
    options: ["Slow down website", "Manipulate database queries", "Block network traffic", "Delete cookies"],
    correctAnswer: 1,
    explanation: "SQL injection allows attackers to manipulate database queries by injecting malicious SQL code"
  },
  {
    id: "cyber-014",
    category: "logical",
    difficulty: "medium",
    topic: "ssl-tls",
    question: "What does SSL/TLS provide?",
    options: ["Faster loading", "Encrypted communication", "Data compression", "Caching"],
    correctAnswer: 1,
    explanation: "SSL/TLS protocols provide encrypted communication between client and server"
  },
  {
    id: "cyber-015",
    category: "logical",
    difficulty: "easy",
    topic: "incident-response",
    question: "What is the first step in incident response?",
    options: ["Recovery", "Identification", "Containment", "Eradication"],
    correctAnswer: 1,
    explanation: "Identification (detection) is the first step in the incident response process"
  }
]

// ==================== CLOUD COMPUTING ====================
export const cloudComputingQuestions: AptitudeQuestion[] = [
  {
    id: "cloud-001",
    category: "logical",
    difficulty: "easy",
    topic: "cloud-basics",
    question: "What does IaaS stand for?",
    options: ["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Information as a Service"],
    correctAnswer: 1,
    explanation: "IaaS (Infrastructure as a Service) provides virtualized computing resources over the internet"
  },
  {
    id: "cloud-002",
    category: "logical",
    difficulty: "medium",
    topic: "service-models",
    question: "Which service model provides the most control to users?",
    options: ["SaaS", "PaaS", "IaaS", "FaaS"],
    correctAnswer: 2,
    explanation: "IaaS provides the most control as users manage OS, applications, and data"
  },
  {
    id: "cloud-003",
    category: "logical",
    difficulty: "easy",
    topic: "deployment-models",
    question: "Which cloud deployment model is shared among multiple organizations?",
    options: ["Private cloud", "Public cloud", "Hybrid cloud", "Community cloud"],
    correctAnswer: 3,
    explanation: "Community cloud is shared infrastructure for specific organizations with common concerns"
  },
  {
    id: "cloud-004",
    category: "logical",
    difficulty: "hard",
    topic: "aws",
    question: "What is AWS S3 primarily used for?",
    options: ["Computing", "Object storage", "Database", "Networking"],
    correctAnswer: 1,
    explanation: "Amazon S3 (Simple Storage Service) is an object storage service"
  },
  {
    id: "cloud-005",
    category: "logical",
    difficulty: "medium",
    topic: "containers",
    question: "What is Docker?",
    options: ["A cloud provider", "A containerization platform", "A programming language", "A database"],
    correctAnswer: 1,
    explanation: "Docker is a platform for developing, shipping, and running applications in containers"
  },
  {
    id: "cloud-006",
    category: "logical",
    difficulty: "easy",
    topic: "virtualization",
    question: "What does a hypervisor do?",
    options: ["Manages databases", "Creates and runs virtual machines", "Encrypts data", "Monitors network"],
    correctAnswer: 1,
    explanation: "A hypervisor creates and manages virtual machines on physical hardware"
  },
  {
    id: "cloud-007",
    category: "logical",
    difficulty: "hard",
    topic: "kubernetes",
    question: "What is Kubernetes used for?",
    options: ["Container orchestration", "Data analysis", "Web hosting", "Email service"],
    correctAnswer: 0,
    explanation: "Kubernetes is a container orchestration platform for automating deployment and management"
  },
  {
    id: "cloud-008",
    category: "logical",
    difficulty: "medium",
    topic: "scalability",
    question: "What is horizontal scaling?",
    options: ["Adding more power to existing servers", "Adding more servers", "Reducing server capacity", "Upgrading software"],
    correctAnswer: 1,
    explanation: "Horizontal scaling (scaling out) means adding more servers to handle increased load"
  },
  {
    id: "cloud-009",
    category: "logical",
    difficulty: "easy",
    topic: "cdn",
    question: "What does CDN stand for?",
    options: ["Cloud Data Network", "Content Delivery Network", "Central Database Node", "Compute Distribution Network"],
    correctAnswer: 1,
    explanation: "CDN (Content Delivery Network) distributes content across geographically distributed servers"
  },
  {
    id: "cloud-010",
    category: "logical",
    difficulty: "hard",
    topic: "serverless",
    question: "What is a key benefit of serverless computing?",
    options: ["No servers are used", "Pay only for execution time", "Unlimited storage", "Faster internet"],
    correctAnswer: 1,
    explanation: "Serverless computing charges only for actual execution time, not idle server time"
  },
  {
    id: "cloud-011",
    category: "logical",
    difficulty: "medium",
    topic: "load-balancing",
    question: "What does a load balancer do?",
    options: ["Stores data", "Distributes traffic across servers", "Encrypts connections", "Backs up files"],
    correctAnswer: 1,
    explanation: "Load balancers distribute incoming network traffic across multiple servers"
  },
  {
    id: "cloud-012",
    category: "logical",
    difficulty: "easy",
    topic: "regions",
    question: "What is an availability zone in cloud computing?",
    options: ["A pricing tier", "An isolated data center location", "A security group", "A user account"],
    correctAnswer: 1,
    explanation: "An availability zone is an isolated location within a cloud region"
  },
  {
    id: "cloud-013",
    category: "logical",
    difficulty: "hard",
    topic: "devops",
    question: "What is the main goal of DevOps?",
    options: ["Reduce costs", "Bridge development and operations", "Improve security", "Increase storage"],
    correctAnswer: 1,
    explanation: "DevOps aims to bridge the gap between development and operations teams for faster delivery"
  },
  {
    id: "cloud-014",
    category: "logical",
    difficulty: "medium",
    topic: "cloud-storage",
    question: "Which type of storage is best for databases in cloud?",
    options: ["Object storage", "Block storage", "File storage", "Archive storage"],
    correctAnswer: 1,
    explanation: "Block storage provides low-latency, high-performance storage ideal for databases"
  },
  {
    id: "cloud-015",
    category: "logical",
    difficulty: "easy",
    topic: "auto-scaling",
    question: "What is auto-scaling?",
    options: ["Manual server management", "Automatic adjustment of resources based on demand", "Fixed resource allocation", "One-time setup"],
    correctAnswer: 1,
    explanation: "Auto-scaling automatically adjusts compute resources based on application demand"
  }
]

// ==================== MOBILE DEVELOPMENT ====================
export const mobileDevelopmentQuestions: AptitudeQuestion[] = [
  {
    id: "mobile-001",
    category: "logical",
    difficulty: "easy",
    topic: "mobile-basics",
    question: "Which language is primarily used for iOS development?",
    options: ["Java", "Swift", "Kotlin", "Python"],
    correctAnswer: 1,
    explanation: "Swift is Apple's primary language for iOS, iPadOS, macOS, and other Apple platforms"
  },
  {
    id: "mobile-002",
    category: "logical",
    difficulty: "easy",
    topic: "android",
    question: "What is the official IDE for Android development?",
    options: ["Visual Studio", "Android Studio", "Eclipse", "Xcode"],
    correctAnswer: 1,
    explanation: "Android Studio is the official IDE for Android app development"
  },
  {
    id: "mobile-003",
    category: "logical",
    difficulty: "medium",
    topic: "cross-platform",
    question: "Which framework allows writing mobile apps for both iOS and Android?",
    options: ["Bootstrap", "React Native", "Django", "Laravel"],
    correctAnswer: 1,
    explanation: "React Native is a cross-platform framework for building iOS and Android apps with JavaScript"
  },
  {
    id: "mobile-004",
    category: "logical",
    difficulty: "medium",
    topic: "lifecycle",
    question: "What is an Activity in Android?",
    options: ["A background service", "A single screen with UI", "A database", "A network request"],
    correctAnswer: 1,
    explanation: "An Activity represents a single screen with a user interface in Android"
  },
  {
    id: "mobile-005",
    category: "logical",
    difficulty: "hard",
    topic: "flutter",
    question: "What language is Flutter based on?",
    options: ["JavaScript", "Java", "Dart", "Python"],
    correctAnswer: 2,
    explanation: "Flutter uses Dart programming language for building cross-platform apps"
  },
  {
    id: "mobile-006",
    category: "logical",
    difficulty: "easy",
    topic: "ui-design",
    question: "What does UI stand for in mobile development?",
    options: ["Universal Interface", "User Interface", "Unified Integration", "Update Installation"],
    correctAnswer: 1,
    explanation: "UI (User Interface) refers to the visual elements users interact with in an app"
  },
  {
    id: "mobile-007",
    category: "logical",
    difficulty: "hard",
    topic: "performance",
    question: "What is lazy loading in mobile development?",
    options: ["Slow app startup", "Loading content only when needed", "Background updates", "Caching data"],
    correctAnswer: 1,
    explanation: "Lazy loading defers loading of resources until they're actually needed, improving performance"
  },
  {
    id: "mobile-008",
    category: "logical",
    difficulty: "medium",
    topic: "storage",
    question: "Which is a common local database for mobile apps?",
    options: ["MySQL", "SQLite", "Oracle", "PostgreSQL"],
    correctAnswer: 1,
    explanation: "SQLite is a lightweight, embedded database commonly used in mobile applications"
  },
  {
    id: "mobile-009",
    category: "logical",
    difficulty: "easy",
    topic: "notifications",
    question: "What are push notifications?",
    options: ["App updates", "Messages sent to users even when app is closed", "Error alerts", "Debug logs"],
    correctAnswer: 1,
    explanation: "Push notifications are messages sent to users' devices even when the app isn't actively running"
  },
  {
    id: "mobile-010",
    category: "logical",
    difficulty: "hard",
    topic: "architecture",
    question: "What is MVVM in mobile development?",
    options: ["A programming language", "Model-View-ViewModel architecture pattern", "A testing framework", "A database"],
    correctAnswer: 1,
    explanation: "MVVM (Model-View-ViewModel) is an architectural pattern for separating UI from business logic"
  },
  {
    id: "mobile-011",
    category: "logical",
    difficulty: "medium",
    topic: "kotlin",
    question: "What is Kotlin's advantage over Java for Android?",
    options: ["Faster execution", "More concise and safer code", "Better graphics", "Larger community"],
    correctAnswer: 1,
    explanation: "Kotlin offers more concise syntax, null safety, and modern language features compared to Java"
  },
  {
    id: "mobile-012",
    category: "logical",
    difficulty: "easy",
    topic: "testing",
    question: "What is unit testing?",
    options: ["Testing entire app", "Testing individual components", "User acceptance testing", "Performance testing"],
    correctAnswer: 1,
    explanation: "Unit testing involves testing individual components or functions in isolation"
  },
  {
    id: "mobile-013",
    category: "logical",
    difficulty: "hard",
    topic: "api-integration",
    question: "What is REST API used for in mobile apps?",
    options: ["UI design", "Communication with backend servers", "Local storage", "Animation"],
    correctAnswer: 1,
    explanation: "REST APIs enable mobile apps to communicate with backend servers for data exchange"
  },
  {
    id: "mobile-014",
    category: "logical",
    difficulty: "medium",
    topic: "responsive-design",
    question: "What is responsive design in mobile development?",
    options: ["Fast loading", "Adapting UI to different screen sizes", "Touch gestures", "Animations"],
    correctAnswer: 1,
    explanation: "Responsive design ensures the UI adapts properly to different screen sizes and orientations"
  },
  {
    id: "mobile-015",
    category: "logical",
    difficulty: "easy",
    topic: "deployment",
    question: "Where are Android apps primarily distributed?",
    options: ["App Store", "Google Play Store", "Microsoft Store", "Amazon Store"],
    correctAnswer: 1,
    explanation: "Google Play Store is the primary distribution platform for Android apps"
  }
]

// ==================== AI/ML ====================
export const aiMlQuestions: AptitudeQuestion[] = [
  {
    id: "aiml-001",
    category: "logical",
    difficulty: "easy",
    topic: "ml-basics",
    question: "What type of learning uses labeled data?",
    options: ["Unsupervised learning", "Supervised learning", "Reinforcement learning", "Transfer learning"],
    correctAnswer: 1,
    explanation: "Supervised learning uses labeled training data where input-output pairs are known"
  },
  {
    id: "aiml-002",
    category: "logical",
    difficulty: "medium",
    topic: "algorithms",
    question: "Which algorithm is used for classification problems?",
    options: ["Linear Regression", "K-Means", "Decision Tree", "PCA"],
    correctAnswer: 2,
    explanation: "Decision Trees can be used for classification by splitting data based on features"
  },
  {
    id: "aiml-003",
    category: "logical",
    difficulty: "easy",
    topic: "neural-networks",
    question: "What is a neuron in artificial neural networks?",
    options: ["A database", "A computational unit", "A file", "A server"],
    correctAnswer: 1,
    explanation: "A neuron is a computational unit that processes inputs and produces an output"
  },
  {
    id: "aiml-004",
    category: "logical",
    difficulty: "hard",
    topic: "deep-learning",
    question: "What is backpropagation used for?",
    options: ["Data preprocessing", "Training neural networks by updating weights", "Feature selection", "Data visualization"],
    correctAnswer: 1,
    explanation: "Backpropagation calculates gradients and updates network weights to minimize error"
  },
  {
    id: "aiml-005",
    category: "logical",
    difficulty: "medium",
    topic: "overfitting",
    question: "What is overfitting in machine learning?",
    options: ["Model is too simple", "Model performs well on training but poorly on new data", "Model trains too fast", "Model uses too much memory"],
    correctAnswer: 1,
    explanation: "Overfitting occurs when a model learns training data too well, including noise, harming generalization"
  },
  {
    id: "aiml-006",
    category: "logical",
    difficulty: "easy",
    topic: "features",
    question: "What is a feature in machine learning?",
    options: ["An error", "An input variable", "An output", "A model"],
    correctAnswer: 1,
    explanation: "A feature is an input variable or attribute used to make predictions"
  },
  {
    id: "aiml-007",
    category: "logical",
    difficulty: "hard",
    topic: "cnn",
    question: "What are CNNs primarily used for?",
    options: ["Text analysis", "Image recognition", "Time series", "Audio processing"],
    correctAnswer: 1,
    explanation: "CNNs (Convolutional Neural Networks) are designed for image recognition and computer vision tasks"
  },
  {
    id: "aiml-008",
    category: "logical",
    difficulty: "medium",
    topic: "clustering",
    question: "What is K-Means used for?",
    options: ["Classification", "Clustering", "Regression", "Dimensionality reduction"],
    correctAnswer: 1,
    explanation: "K-Means is an unsupervised learning algorithm used for clustering data into K groups"
  },
  {
    id: "aiml-009",
    category: "logical",
    difficulty: "easy",
    topic: "training",
    question: "What is an epoch in training?",
    options: ["One data point", "One complete pass through training data", "One layer", "One prediction"],
    correctAnswer: 1,
    explanation: "An epoch is one complete pass through the entire training dataset"
  },
  {
    id: "aiml-010",
    category: "logical",
    difficulty: "hard",
    topic: "nlp",
    question: "What does NLP stand for?",
    options: ["New Learning Process", "Natural Language Processing", "Neural Layer Protocol", "Network Learning Platform"],
    correctAnswer: 1,
    explanation: "NLP (Natural Language Processing) enables computers to understand and process human language"
  },
  {
    id: "aiml-011",
    category: "logical",
    difficulty: "medium",
    topic: "activation-functions",
    question: "What is the purpose of an activation function?",
    options: ["Store data", "Introduce non-linearity", "Normalize data", "Reduce dimensions"],
    correctAnswer: 1,
    explanation: "Activation functions introduce non-linearity, allowing networks to learn complex patterns"
  },
  {
    id: "aiml-012",
    category: "logical",
    difficulty: "easy",
    topic: "regression",
    question: "What does regression predict?",
    options: ["Categories", "Continuous values", "Clusters", "Rules"],
    correctAnswer: 1,
    explanation: "Regression algorithms predict continuous numerical values"
  },
  {
    id: "aiml-013",
    category: "logical",
    difficulty: "hard",
    topic: "gradient-descent",
    question: "What is gradient descent?",
    options: ["A neural network type", "An optimization algorithm", "A data structure", "A preprocessing technique"],
    correctAnswer: 1,
    explanation: "Gradient descent is an optimization algorithm that minimizes the loss function by updating parameters"
  },
  {
    id: "aiml-014",
    category: "logical",
    difficulty: "medium",
    topic: "accuracy",
    question: "What does model accuracy measure?",
    options: ["Training speed", "Percentage of correct predictions", "Model size", "Data quality"],
    correctAnswer: 1,
    explanation: "Accuracy measures the percentage of correct predictions out of total predictions"
  },
  {
    id: "aiml-015",
    category: "logical",
    difficulty: "easy",
    topic: "tensorflow",
    question: "What is TensorFlow?",
    options: ["A database", "A machine learning framework", "A programming language", "An operating system"],
    correctAnswer: 1,
    explanation: "TensorFlow is an open-source machine learning framework developed by Google"
  }
]

// Export domain question pools
export const domainQuestionPools = {
  'data-science': dataScienceQuestions,
  'web-development': webDevelopmentQuestions,
  'cybersecurity': cybersecurityQuestions,
  'cloud-computing': cloudComputingQuestions,
  'mobile-development': mobileDevelopmentQuestions,
  'ai-ml': aiMlQuestions
}

export type DomainType = keyof typeof domainQuestionPools

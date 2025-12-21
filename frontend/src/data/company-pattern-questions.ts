import { AptitudeQuestion } from './aptitude-questions'

// ==================== FAANG PATTERN ====================
export const faangQuestions: AptitudeQuestion[] = [
  {
    id: "faang-001",
    category: "logical",
    difficulty: "hard",
    topic: "data-structures",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search has O(log n) time complexity as it divides the search space in half each iteration"
  },
  {
    id: "faang-002",
    category: "logical",
    difficulty: "hard",
    topic: "algorithms",
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
    correctAnswer: 1,
    explanation: "Quick Sort has O(n log n) average-case time complexity, making it one of the fastest sorting algorithms"
  },
  {
    id: "faang-003",
    category: "logical",
    difficulty: "hard",
    topic: "system-design",
    question: "What is sharding in database design?",
    options: ["Data backup", "Horizontal partitioning of data", "Vertical partitioning", "Data encryption"],
    correctAnswer: 1,
    explanation: "Sharding is horizontal partitioning where data is distributed across multiple databases"
  },
  {
    id: "faang-004",
    category: "logical",
    difficulty: "medium",
    topic: "arrays",
    question: "What data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctAnswer: 1,
    explanation: "Stack follows LIFO principle where the last element added is the first one removed"
  },
  {
    id: "faang-005",
    category: "logical",
    difficulty: "hard",
    topic: "trees",
    question: "In a balanced binary search tree, what is the height with n nodes?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "A balanced BST maintains height of O(log n) to ensure efficient operations"
  },
  {
    id: "faang-006",
    category: "logical",
    difficulty: "medium",
    topic: "hash-tables",
    question: "What is the average time complexity for hash table insertion?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Hash tables provide O(1) average-case time complexity for insertion due to direct indexing"
  },
  {
    id: "faang-007",
    category: "logical",
    difficulty: "hard",
    topic: "graphs",
    question: "Which algorithm finds the shortest path in a weighted graph?",
    options: ["BFS", "DFS", "Dijkstra's", "Binary Search"],
    correctAnswer: 2,
    explanation: "Dijkstra's algorithm finds the shortest path in weighted graphs with non-negative edge weights"
  },
  {
    id: "faang-008",
    category: "logical",
    difficulty: "hard",
    topic: "dynamic-programming",
    question: "What technique does dynamic programming use to optimize recursive solutions?",
    options: ["Memoization", "Randomization", "Greedy approach", "Brute force"],
    correctAnswer: 0,
    explanation: "Dynamic programming uses memoization to store and reuse results of subproblems"
  },
  {
    id: "faang-009",
    category: "logical",
    difficulty: "medium",
    topic: "linked-lists",
    question: "What is an advantage of linked lists over arrays?",
    options: ["Faster access", "Dynamic size", "Better cache performance", "Simpler implementation"],
    correctAnswer: 1,
    explanation: "Linked lists can grow and shrink dynamically without pre-allocation of memory"
  },
  {
    id: "faang-010",
    category: "logical",
    difficulty: "hard",
    topic: "complexity",
    question: "What is space complexity?",
    options: ["Time taken by algorithm", "Memory used by algorithm", "Number of operations", "Code length"],
    correctAnswer: 1,
    explanation: "Space complexity measures the amount of memory an algorithm uses relative to input size"
  },
  {
    id: "faang-011",
    category: "quantitative",
    difficulty: "hard",
    topic: "bitwise",
    question: "What does XOR of two identical numbers equal?",
    options: ["1", "0", "The number itself", "-1"],
    correctAnswer: 1,
    explanation: "XOR of two identical numbers is always 0 (e.g., 5 XOR 5 = 0)"
  },
  {
    id: "faang-012",
    category: "logical",
    difficulty: "hard",
    topic: "recursion",
    question: "What is the base case in recursion?",
    options: ["First recursive call", "Condition to stop recursion", "The main function", "Error handling"],
    correctAnswer: 1,
    explanation: "The base case is the condition that stops recursion to prevent infinite loops"
  },
  {
    id: "faang-013",
    category: "logical",
    difficulty: "medium",
    topic: "queues",
    question: "What principle does a queue follow?",
    options: ["LIFO", "FIFO", "Random", "Priority"],
    correctAnswer: 1,
    explanation: "Queue follows FIFO (First In First Out) principle"
  },
  {
    id: "faang-014",
    category: "logical",
    difficulty: "hard",
    topic: "heaps",
    question: "What is the time complexity of extracting the minimum element from a min-heap?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation: "Extracting min from a min-heap takes O(log n) due to heap rebalancing"
  },
  {
    id: "faang-015",
    category: "logical",
    difficulty: "hard",
    topic: "string-manipulation",
    question: "What is the time complexity of reversing a string of length n?",
    options: ["O(1)", "O(n)", "O(n²)", "O(log n)"],
    correctAnswer: 1,
    explanation: "Reversing requires visiting each character once, resulting in O(n) time complexity"
  },
  {
    id: "faang-016",
    category: "logical",
    difficulty: "hard",
    topic: "caching",
    question: "What is LRU cache?",
    options: ["Latest Resource Updated", "Least Recently Used", "Last Requested Update", "Limited Resource Usage"],
    correctAnswer: 1,
    explanation: "LRU (Least Recently Used) cache evicts the least recently accessed item when full"
  },
  {
    id: "faang-017",
    category: "logical",
    difficulty: "medium",
    topic: "searching",
    question: "What is required for binary search to work?",
    options: ["Unsorted array", "Sorted array", "Linked list", "Hash table"],
    correctAnswer: 1,
    explanation: "Binary search requires a sorted array to efficiently divide the search space"
  },
  {
    id: "faang-018",
    category: "logical",
    difficulty: "hard",
    topic: "greedy-algorithms",
    question: "What strategy does a greedy algorithm follow?",
    options: ["Optimal global solution", "Local optimal choice at each step", "Random selection", "Exhaustive search"],
    correctAnswer: 1,
    explanation: "Greedy algorithms make locally optimal choices hoping to find a global optimum"
  },
  {
    id: "faang-019",
    category: "logical",
    difficulty: "hard",
    topic: "tries",
    question: "What is a Trie primarily used for?",
    options: ["Sorting numbers", "String searching and prefix matching", "Graph traversal", "Mathematical operations"],
    correctAnswer: 1,
    explanation: "Trie (prefix tree) is efficient for string searching and autocomplete features"
  },
  {
    id: "faang-020",
    category: "logical",
    difficulty: "hard",
    topic: "two-pointers",
    question: "What is the two-pointer technique useful for?",
    options: ["Database queries", "Array/string problems with linear scan", "Tree traversal", "Sorting"],
    correctAnswer: 1,
    explanation: "Two-pointer technique efficiently solves array/string problems by using two indices"
  }
]

// ==================== STARTUP PATTERN ====================
export const startupQuestions: AptitudeQuestion[] = [
  {
    id: "startup-001",
    category: "logical",
    difficulty: "medium",
    topic: "problem-solving",
    question: "What is the most important factor when choosing a tech stack for a startup?",
    options: ["Latest technology", "Team expertise and speed", "Most expensive tools", "Popular frameworks"],
    correctAnswer: 1,
    explanation: "Startups prioritize speed and team expertise over using the latest or most popular technology"
  },
  {
    id: "startup-002",
    category: "logical",
    difficulty: "easy",
    topic: "agile",
    question: "What does MVP stand for in startup context?",
    options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Value Proposition", "Minimal Verified Platform"],
    correctAnswer: 1,
    explanation: "MVP (Minimum Viable Product) is a version with just enough features to gather user feedback"
  },
  {
    id: "startup-003",
    category: "logical",
    difficulty: "medium",
    topic: "full-stack",
    question: "What skill is most valuable for startup developers?",
    options: ["Deep specialization in one area", "Full-stack versatility", "Management skills", "Sales ability"],
    correctAnswer: 1,
    explanation: "Startups value full-stack developers who can work across the entire application stack"
  },
  {
    id: "startup-004",
    category: "logical",
    difficulty: "medium",
    topic: "deployment",
    question: "What is continuous deployment?",
    options: ["Manual releases", "Automatic deployment after passing tests", "Weekly releases", "Annual updates"],
    correctAnswer: 1,
    explanation: "Continuous deployment automatically releases code to production after passing automated tests"
  },
  {
    id: "startup-005",
    category: "logical",
    difficulty: "easy",
    topic: "version-control",
    question: "What is the purpose of branching in Git?",
    options: ["Delete code", "Work on features independently", "Slow down development", "Create backups"],
    correctAnswer: 1,
    explanation: "Branching allows developers to work on features independently without affecting the main codebase"
  },
  {
    id: "startup-006",
    category: "logical",
    difficulty: "medium",
    topic: "databases",
    question: "When should you choose NoSQL over SQL?",
    options: ["Always", "For flexible, unstructured data", "For small datasets", "For financial data only"],
    correctAnswer: 1,
    explanation: "NoSQL is ideal for flexible schemas and unstructured/semi-structured data"
  },
  {
    id: "startup-007",
    category: "logical",
    difficulty: "medium",
    topic: "apis",
    question: "What is the benefit of RESTful APIs?",
    options: ["Complexity", "Stateless, scalable communication", "Requires more code", "Slower performance"],
    correctAnswer: 1,
    explanation: "RESTful APIs are stateless and scalable, making them ideal for web services"
  },
  {
    id: "startup-008",
    category: "logical",
    difficulty: "easy",
    topic: "testing",
    question: "What is the main purpose of unit testing?",
    options: ["Test entire application", "Test individual components", "Test user interface", "Test database"],
    correctAnswer: 1,
    explanation: "Unit testing validates individual components or functions work correctly in isolation"
  },
  {
    id: "startup-009",
    category: "logical",
    difficulty: "medium",
    topic: "scalability",
    question: "What does 'scale horizontally' mean?",
    options: ["Upgrade existing servers", "Add more servers", "Reduce servers", "Change architecture"],
    correctAnswer: 1,
    explanation: "Horizontal scaling means adding more servers to distribute the load"
  },
  {
    id: "startup-010",
    category: "logical",
    difficulty: "medium",
    topic: "microservices",
    question: "What is a key benefit of microservices architecture?",
    options: ["Single codebase", "Independent deployment of services", "Simpler than monolith", "Less code"],
    correctAnswer: 1,
    explanation: "Microservices allow independent development and deployment of different services"
  },
  {
    id: "startup-011",
    category: "logical",
    difficulty: "easy",
    topic: "cloud",
    question: "What is the main advantage of cloud hosting?",
    options: ["Free forever", "Scalability and pay-as-you-go", "Unlimited storage", "No internet needed"],
    correctAnswer: 1,
    explanation: "Cloud hosting offers scalability and cost efficiency with pay-as-you-go pricing"
  },
  {
    id: "startup-012",
    category: "logical",
    difficulty: "medium",
    topic: "monitoring",
    question: "Why is logging important in applications?",
    options: ["Slow down app", "Debug issues and track behavior", "Increase storage", "Confuse users"],
    correctAnswer: 1,
    explanation: "Logging helps developers debug issues and understand application behavior in production"
  },
  {
    id: "startup-013",
    category: "logical",
    difficulty: "medium",
    topic: "authentication",
    question: "What is JWT used for?",
    options: ["Database queries", "Secure token-based authentication", "File uploads", "Image processing"],
    correctAnswer: 1,
    explanation: "JWT (JSON Web Token) is used for secure, stateless authentication between parties"
  },
  {
    id: "startup-014",
    category: "logical",
    difficulty: "easy",
    topic: "responsive-design",
    question: "What is mobile-first design?",
    options: ["Design only for mobile", "Design for mobile before desktop", "Ignore desktop users", "Mobile testing"],
    correctAnswer: 1,
    explanation: "Mobile-first design starts with mobile layout and progressively enhances for larger screens"
  },
  {
    id: "startup-015",
    category: "logical",
    difficulty: "medium",
    topic: "performance",
    question: "What is code minification?",
    options: ["Making code readable", "Removing unnecessary characters to reduce file size", "Adding comments", "Debugging"],
    correctAnswer: 1,
    explanation: "Minification removes whitespace, comments, and unnecessary characters to reduce file size"
  },
  {
    id: "startup-016",
    category: "logical",
    difficulty: "medium",
    topic: "security",
    question: "What is HTTPS?",
    options: ["Faster HTTP", "HTTP with SSL/TLS encryption", "New protocol", "HTTP version 2"],
    correctAnswer: 1,
    explanation: "HTTPS is HTTP with SSL/TLS encryption for secure communication"
  },
  {
    id: "startup-017",
    category: "logical",
    difficulty: "easy",
    topic: "debugging",
    question: "What is a breakpoint in debugging?",
    options: ["An error", "Point where execution pauses", "End of program", "A bug"],
    correctAnswer: 1,
    explanation: "A breakpoint is a marker where code execution pauses for inspection during debugging"
  },
  {
    id: "startup-018",
    category: "logical",
    difficulty: "medium",
    topic: "caching",
    question: "What is the purpose of browser caching?",
    options: ["Slow down website", "Store resources locally for faster loading", "Increase bandwidth", "Track users"],
    correctAnswer: 1,
    explanation: "Browser caching stores resources locally to reduce server requests and improve load times"
  },
  {
    id: "startup-019",
    category: "logical",
    difficulty: "medium",
    topic: "docker",
    question: "What problem does Docker solve?",
    options: ["Code editing", "Environment consistency across systems", "Database management", "UI design"],
    correctAnswer: 1,
    explanation: "Docker ensures applications run consistently across different environments using containers"
  },
  {
    id: "startup-020",
    category: "logical",
    difficulty: "easy",
    topic: "git-workflow",
    question: "What does 'git commit' do?",
    options: ["Delete files", "Save changes to local repository", "Push to remote", "Create branch"],
    correctAnswer: 1,
    explanation: "Git commit saves staged changes to the local repository with a descriptive message"
  }
]

// ==================== SERVICE-BASED PATTERN ====================
export const serviceBasedQuestions: AptitudeQuestion[] = [
  {
    id: "service-001",
    category: "logical",
    difficulty: "easy",
    topic: "oops",
    question: "What is encapsulation in OOP?",
    options: ["Hiding implementation details", "Creating objects", "Inheritance", "Polymorphism"],
    correctAnswer: 0,
    explanation: "Encapsulation is bundling data and methods while hiding internal implementation details"
  },
  {
    id: "service-002",
    category: "logical",
    difficulty: "easy",
    topic: "java",
    question: "Which keyword is used for inheritance in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correctAnswer: 1,
    explanation: "The 'extends' keyword is used for class inheritance in Java"
  },
  {
    id: "service-003",
    category: "logical",
    difficulty: "medium",
    topic: "polymorphism",
    question: "What is method overloading?",
    options: ["Same method name in different classes", "Same method name with different parameters", "Overriding parent method", "Creating methods"],
    correctAnswer: 1,
    explanation: "Method overloading allows multiple methods with the same name but different parameters"
  },
  {
    id: "service-004",
    category: "logical",
    difficulty: "easy",
    topic: "databases",
    question: "What does SQL stand for?",
    options: ["Simple Query Language", "Structured Query Language", "Standard Question Language", "System Quality Language"],
    correctAnswer: 1,
    explanation: "SQL stands for Structured Query Language, used for managing relational databases"
  },
  {
    id: "service-005",
    category: "logical",
    difficulty: "medium",
    topic: "joins",
    question: "What does INNER JOIN return?",
    options: ["All records from both tables", "Only matching records from both tables", "Left table records only", "Right table records only"],
    correctAnswer: 1,
    explanation: "INNER JOIN returns only the records that have matching values in both tables"
  },
  {
    id: "service-006",
    category: "logical",
    difficulty: "easy",
    topic: "normalization",
    question: "What is database normalization?",
    options: ["Making database faster", "Organizing data to reduce redundancy", "Backing up data", "Encrypting data"],
    correctAnswer: 1,
    explanation: "Normalization organizes database tables to minimize redundancy and dependency"
  },
  {
    id: "service-007",
    category: "logical",
    difficulty: "medium",
    topic: "transactions",
    question: "What does ACID stand for in databases?",
    options: ["Atomicity, Consistency, Isolation, Durability", "Automatic, Consistent, Integrated, Durable", "Advanced, Complete, Isolated, Direct", "All, Clear, Indexed, Data"],
    correctAnswer: 0,
    explanation: "ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, Durability"
  },
  {
    id: "service-008",
    category: "logical",
    difficulty: "easy",
    topic: "exception-handling",
    question: "What is the purpose of try-catch blocks?",
    options: ["Speed up code", "Handle errors gracefully", "Create loops", "Define variables"],
    correctAnswer: 1,
    explanation: "Try-catch blocks handle exceptions and prevent program crashes"
  },
  {
    id: "service-009",
    category: "logical",
    difficulty: "medium",
    topic: "collections",
    question: "What is the difference between ArrayList and LinkedList?",
    options: ["No difference", "ArrayList uses array, LinkedList uses nodes", "ArrayList is slower", "LinkedList can't grow"],
    correctAnswer: 1,
    explanation: "ArrayList uses dynamic arrays while LinkedList uses doubly-linked nodes"
  },
  {
    id: "service-010",
    category: "logical",
    difficulty: "easy",
    topic: "interfaces",
    question: "Can a Java class extend multiple classes?",
    options: ["Yes", "No", "Only interfaces", "Depends on version"],
    correctAnswer: 1,
    explanation: "Java doesn't support multiple inheritance for classes, but a class can implement multiple interfaces"
  },
  {
    id: "service-011",
    category: "logical",
    difficulty: "medium",
    topic: "threading",
    question: "What is multithreading?",
    options: ["Using multiple processors", "Concurrent execution of multiple threads", "Multiple programs running", "Parallel processing"],
    correctAnswer: 1,
    explanation: "Multithreading allows concurrent execution of two or more threads within a program"
  },
  {
    id: "service-012",
    category: "logical",
    difficulty: "easy",
    topic: "access-modifiers",
    question: "Which access modifier makes a member accessible only within its class?",
    options: ["public", "private", "protected", "default"],
    correctAnswer: 1,
    explanation: "Private members are accessible only within the class they are declared"
  },
  {
    id: "service-013",
    category: "logical",
    difficulty: "medium",
    topic: "design-patterns",
    question: "What is the Singleton design pattern?",
    options: ["Multiple instances", "Exactly one instance of a class", "No instances", "Infinite instances"],
    correctAnswer: 1,
    explanation: "Singleton pattern ensures a class has only one instance and provides global access to it"
  },
  {
    id: "service-014",
    category: "logical",
    difficulty: "easy",
    topic: "testing",
    question: "What is integration testing?",
    options: ["Testing individual units", "Testing how modules work together", "Testing UI", "Testing security"],
    correctAnswer: 1,
    explanation: "Integration testing verifies that different modules or services work together correctly"
  },
  {
    id: "service-015",
    category: "logical",
    difficulty: "medium",
    topic: "sdlc",
    question: "What does SDLC stand for?",
    options: ["Software Design Life Cycle", "Software Development Life Cycle", "System Data Life Cycle", "Standard Development Logic Cycle"],
    correctAnswer: 1,
    explanation: "SDLC (Software Development Life Cycle) is the process of planning, creating, testing, and deploying software"
  },
  {
    id: "service-016",
    category: "logical",
    difficulty: "easy",
    topic: "abstract-class",
    question: "Can you create an object of an abstract class?",
    options: ["Yes", "No", "Sometimes", "Only with new keyword"],
    correctAnswer: 1,
    explanation: "Abstract classes cannot be instantiated; they serve as base classes for other classes"
  },
  {
    id: "service-017",
    category: "logical",
    difficulty: "medium",
    topic: "garbage-collection",
    question: "What is garbage collection in Java?",
    options: ["Deleting files", "Automatic memory management", "Cleaning code", "Removing bugs"],
    correctAnswer: 1,
    explanation: "Garbage collection automatically reclaims memory occupied by objects no longer in use"
  },
  {
    id: "service-018",
    category: "logical",
    difficulty: "easy",
    topic: "primary-key",
    question: "What is a primary key in databases?",
    options: ["Foreign reference", "Unique identifier for records", "Index", "Backup key"],
    correctAnswer: 1,
    explanation: "Primary key is a unique identifier that ensures each record in a table is unique"
  },
  {
    id: "service-019",
    category: "logical",
    difficulty: "medium",
    topic: "indexing",
    question: "What is the purpose of database indexing?",
    options: ["Store more data", "Speed up query performance", "Encrypt data", "Backup data"],
    correctAnswer: 1,
    explanation: "Indexing creates data structures that improve the speed of data retrieval operations"
  },
  {
    id: "service-020",
    category: "logical",
    difficulty: "easy",
    topic: "constructor",
    question: "What is a constructor in OOP?",
    options: ["A method", "Special method to initialize objects", "A variable", "A loop"],
    correctAnswer: 1,
    explanation: "A constructor is a special method called when an object is created to initialize its state"
  }
]

// Export company pattern question pools
export const companyPatternPools = {
  'faang': faangQuestions,
  'startup': startupQuestions,
  'service-based': serviceBasedQuestions
}

export type CompanyPatternType = keyof typeof companyPatternPools

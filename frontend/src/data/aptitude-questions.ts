export interface AptitudeQuestion {
  id: string
  category: 'logical' | 'quantitative' | 'verbal'
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  timeLimit?: number
}

export const logicalReasoningQuestions: AptitudeQuestion[] = [
  {
    id: "log-001",
    category: "logical",
    difficulty: "easy",
    topic: "pattern-recognition",
    question: "Complete the series: 2, 4, 8, 16, __",
    options: ["24", "28", "32", "36"],
    correctAnswer: 2,
    explanation: "Each number is multiplied by 2. So 16 × 2 = 32"
  },
  {
    id: "log-002",
    category: "logical",
    difficulty: "easy",
    topic: "pattern-recognition",
    question: "Find the odd one out: Dog, Cat, Lion, Table, Horse",
    options: ["Dog", "Cat", "Table", "Horse"],
    correctAnswer: 2,
    explanation: "Table is not a living animal, while all others are animals"
  },
  {
    id: "log-003",
    category: "logical",
    difficulty: "medium",
    topic: "analogies",
    question: "Book is to Reading as Fork is to?",
    options: ["Drawing", "Writing", "Eating", "Stirring"],
    correctAnswer: 2,
    explanation: "A book is used for reading, similarly a fork is used for eating"
  },
  {
    id: "log-004",
    category: "logical",
    difficulty: "medium",
    topic: "coding-decoding",
    question: "If CODING is written as DPEJOH, how is BEST written?",
    options: ["CFTU", "ADRS", "CETU", "BGTU"],
    correctAnswer: 0,
    explanation: "Each letter is shifted by +1 position. B→C, E→F, S→T, T→U"
  },
  {
    id: "log-005",
    category: "logical",
    difficulty: "easy",
    topic: "series",
    question: "Complete: A, C, E, G, __",
    options: ["H", "I", "J", "K"],
    correctAnswer: 1,
    explanation: "The pattern skips one letter each time. After G comes I (skipping H)"
  },
  {
    id: "log-006",
    category: "logical",
    difficulty: "medium",
    topic: "blood-relations",
    question: "A is B's sister. B is C's mother. D is C's father. How is A related to D?",
    options: ["Sister", "Wife", "Sister-in-law", "Cousin"],
    correctAnswer: 2,
    explanation: "A is B's sister, and B is married to D (as they are C's parents), so A is D's sister-in-law"
  },
  {
    id: "log-007",
    category: "logical",
    difficulty: "hard",
    topic: "logical-deduction",
    question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?",
    options: ["True", "False", "Cannot be determined", "Sometimes true"],
    correctAnswer: 0,
    explanation: "This is a valid syllogism. If A⊆B and B⊆C, then A⊆C"
  },
  {
    id: "log-008",
    category: "logical",
    difficulty: "medium",
    topic: "direction-sense",
    question: "A man walks 5km north, then 3km east, then 5km south. How far is he from the starting point?",
    options: ["3km", "5km", "8km", "13km"],
    correctAnswer: 0,
    explanation: "He returns to the same latitude (5km north then 5km south cancel out) but is 3km east of start"
  },
  {
    id: "log-009",
    category: "logical",
    difficulty: "hard",
    topic: "number-series",
    question: "Find the next number: 1, 1, 2, 6, 24, __",
    options: ["48", "96", "120", "144"],
    correctAnswer: 2,
    explanation: "Each number is the previous number multiplied by its position: 1×1=1, 1×2=2, 2×3=6, 6×4=24, 24×5=120"
  },
  {
    id: "log-010",
    category: "logical",
    difficulty: "easy",
    topic: "classification",
    question: "Which does not belong: Triangle, Square, Circle, Rectangle, Cube",
    options: ["Triangle", "Circle", "Cube", "Square"],
    correctAnswer: 2,
    explanation: "Cube is a 3D shape while all others are 2D shapes"
  },
  {
    id: "log-011",
    category: "logical",
    difficulty: "medium",
    topic: "statement-conclusion",
    question: "Statement: All roses are flowers. Some flowers fade quickly. Conclusion: Some roses fade quickly.",
    options: ["Definitely true", "Definitely false", "Possibly true", "Data insufficient"],
    correctAnswer: 2,
    explanation: "We know some flowers fade quickly, but we cannot definitively say if those flowers include roses"
  },
  {
    id: "log-012",
    category: "logical",
    difficulty: "hard",
    topic: "puzzle",
    question: "Five friends are sitting in a row. A is to the left of B but to the right of C. D is to the right of B but to the left of E. Who is in the middle?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    explanation: "Order is C-A-B-D-E, so B is in the middle position"
  },
  {
    id: "log-013",
    category: "logical",
    difficulty: "easy",
    topic: "mirror-image",
    question: "What is the mirror image of 'SUNRISE'?",
    options: ["ESINRUS", "ESIRNUS", "ƎƧIИЯUƧ", "SUNRESI"],
    correctAnswer: 2,
    explanation: "Mirror image reverses the text horizontally with reversed letter shapes"
  },
  {
    id: "log-014",
    category: "logical",
    difficulty: "medium",
    topic: "calendar",
    question: "If 15th August 2023 was Tuesday, what day was 15th August 2024?",
    options: ["Tuesday", "Wednesday", "Thursday", "Friday"],
    correctAnswer: 2,
    explanation: "2024 is a leap year with 366 days. 366 = 52 weeks + 2 days, so the day shifts by 2 positions forward"
  },
  {
    id: "log-015",
    category: "logical",
    difficulty: "hard",
    topic: "seating-arrangement",
    question: "6 people A,B,C,D,E,F sit around a circular table. A sits opposite to D. B sits between A and C. Who sits opposite to B?",
    options: ["C", "D", "E", "F"],
    correctAnswer: 2,
    explanation: "In a circular arrangement of 6, the opposite person is 3 positions away. If we arrange: A-B-C-D-E-F, then E sits opposite to B"
  },
  {
    id: "log-016",
    category: "logical",
    difficulty: "medium",
    topic: "word-formation",
    question: "Which word can be formed using all letters of 'TRIANGLE' only once?",
    options: ["ALTERING", "INTEGRAL", "RELATING", "All of these"],
    correctAnswer: 3,
    explanation: "All three words use the same 8 letters as TRIANGLE, just rearranged"
  },
  {
    id: "log-017",
    category: "logical",
    difficulty: "easy",
    topic: "odd-one-out",
    question: "Find the odd one: 3, 5, 11, 14, 17, 21",
    options: ["3", "5", "14", "21"],
    correctAnswer: 2,
    explanation: "All except 14 are prime numbers"
  },
  {
    id: "log-018",
    category: "logical",
    difficulty: "hard",
    topic: "venn-diagram",
    question: "In a class of 60 students, 40 play cricket, 35 play football, and 20 play both. How many play neither?",
    options: ["5", "10", "15", "20"],
    correctAnswer: 0,
    explanation: "Students playing at least one sport = 40 + 35 - 20 = 55. So, 60 - 55 = 5 play neither"
  },
  {
    id: "log-019",
    category: "logical",
    difficulty: "medium",
    topic: "clock",
    question: "At what time between 3 and 4 o'clock are the hands of a clock together?",
    options: ["3:15", "3:16.36", "3:20", "3:18"],
    correctAnswer: 1,
    explanation: "The hands coincide at 3:16 and approximately 22 seconds (3:16.36)"
  },
  {
    id: "log-020",
    category: "logical",
    difficulty: "easy",
    topic: "ranking",
    question: "In a row of 25 students, Ram is 12th from the left. What is his position from the right?",
    options: ["13th", "14th", "15th", "16th"],
    correctAnswer: 1,
    explanation: "Position from right = Total - Position from left + 1 = 25 - 12 + 1 = 14"
  }
]

export const quantitativeQuestions: AptitudeQuestion[] = [
  {
    id: "quant-001",
    category: "quantitative",
    difficulty: "easy",
    topic: "arithmetic",
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
    explanation: "15% of 200 = (15/100) × 200 = 30"
  },
  {
    id: "quant-002",
    category: "quantitative",
    difficulty: "easy",
    topic: "arithmetic",
    question: "If a train travels 120 km in 2 hours, what is its average speed?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    correctAnswer: 1,
    explanation: "Speed = Distance/Time = 120/2 = 60 km/h"
  },
  {
    id: "quant-003",
    category: "quantitative",
    difficulty: "medium",
    topic: "percentage",
    question: "A shopkeeper marks up his goods by 40% and gives a discount of 20%. What is his net profit percentage?",
    options: ["10%", "12%", "15%", "20%"],
    correctAnswer: 1,
    explanation: "Let CP = 100. MP = 140. SP = 140 × 0.8 = 112. Profit% = (112-100)/100 × 100 = 12%"
  },
  {
    id: "quant-004",
    category: "quantitative",
    difficulty: "easy",
    topic: "ratio",
    question: "The ratio of boys to girls in a class is 3:2. If there are 15 boys, how many girls are there?",
    options: ["8", "10", "12", "15"],
    correctAnswer: 1,
    explanation: "If 3 parts = 15 boys, then 1 part = 5. So 2 parts (girls) = 10"
  },
  {
    id: "quant-005",
    category: "quantitative",
    difficulty: "medium",
    topic: "simple-interest",
    question: "What is the simple interest on $1000 at 5% per annum for 2 years?",
    options: ["$50", "$75", "$100", "$150"],
    correctAnswer: 2,
    explanation: "SI = (P × R × T)/100 = (1000 × 5 × 2)/100 = $100"
  },
  {
    id: "quant-006",
    category: "quantitative",
    difficulty: "hard",
    topic: "compound-interest",
    question: "Find compound interest on $5000 at 10% per annum for 2 years compounded annually",
    options: ["$1000", "$1050", "$1100", "$1150"],
    correctAnswer: 1,
    explanation: "A = P(1+r)^n = 5000(1.1)^2 = 6050. CI = 6050 - 5000 = $1050"
  },
  {
    id: "quant-007",
    category: "quantitative",
    difficulty: "easy",
    topic: "average",
    question: "The average of 5 numbers is 20. If one number is excluded, the average becomes 15. What is the excluded number?",
    options: ["35", "40", "45", "50"],
    correctAnswer: 1,
    explanation: "Sum of 5 numbers = 100. Sum of 4 numbers = 60. Excluded number = 100 - 60 = 40"
  },
  {
    id: "quant-008",
    category: "quantitative",
    difficulty: "medium",
    topic: "time-work",
    question: "A can complete a work in 12 days and B in 18 days. How many days will they take together?",
    options: ["6.5 days", "7.2 days", "8 days", "9 days"],
    correctAnswer: 1,
    explanation: "Work done per day: A = 1/12, B = 1/18. Together = 1/12 + 1/18 = 5/36. Days = 36/5 = 7.2 days"
  },
  {
    id: "quant-009",
    category: "quantitative",
    difficulty: "hard",
    topic: "probability",
    question: "What is the probability of getting at least one head when two coins are tossed?",
    options: ["1/4", "1/2", "3/4", "1"],
    correctAnswer: 2,
    explanation: "Total outcomes = 4 (HH, HT, TH, TT). Favorable outcomes (at least one head) = 3. P = 3/4"
  },
  {
    id: "quant-010",
    category: "quantitative",
    difficulty: "medium",
    topic: "profit-loss",
    question: "A man buys an article for $50 and sells it for $60. What is his profit percentage?",
    options: ["10%", "15%", "20%", "25%"],
    correctAnswer: 2,
    explanation: "Profit = 60 - 50 = 10. Profit% = (10/50) × 100 = 20%"
  },
  {
    id: "quant-011",
    category: "quantitative",
    difficulty: "easy",
    topic: "algebra",
    question: "Solve for x: 2x + 5 = 15",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    explanation: "2x = 15 - 5 = 10, therefore x = 5"
  },
  {
    id: "quant-012",
    category: "quantitative",
    difficulty: "hard",
    topic: "geometry",
    question: "The area of a circle is 154 sq cm. What is its radius? (Use π = 22/7)",
    options: ["5 cm", "6 cm", "7 cm", "8 cm"],
    correctAnswer: 2,
    explanation: "πr² = 154. (22/7)r² = 154. r² = 49. r = 7 cm"
  },
  {
    id: "quant-013",
    category: "quantitative",
    difficulty: "medium",
    topic: "mixture",
    question: "In what ratio must water be mixed with milk costing $12/liter to get a mixture worth $10/liter?",
    options: ["1:5", "1:6", "2:5", "1:4"],
    correctAnswer: 0,
    explanation: "Using allegation: (12-10):(10-0) = 2:10 = 1:5"
  },
  {
    id: "quant-014",
    category: "quantitative",
    difficulty: "easy",
    topic: "number-system",
    question: "What is the smallest prime number greater than 10?",
    options: ["11", "12", "13", "14"],
    correctAnswer: 0,
    explanation: "11 is the smallest prime number after 10"
  },
  {
    id: "quant-015",
    category: "quantitative",
    difficulty: "medium",
    topic: "time-distance",
    question: "A car covers a distance of 300 km at 60 km/h. How long does it take?",
    options: ["4 hours", "5 hours", "6 hours", "7 hours"],
    correctAnswer: 1,
    explanation: "Time = Distance/Speed = 300/60 = 5 hours"
  },
  {
    id: "quant-016",
    category: "quantitative",
    difficulty: "hard",
    topic: "permutation-combination",
    question: "In how many ways can 5 people be arranged in a row?",
    options: ["60", "100", "120", "150"],
    correctAnswer: 2,
    explanation: "Number of arrangements = 5! = 5 × 4 × 3 × 2 × 1 = 120"
  },
  {
    id: "quant-017",
    category: "quantitative",
    difficulty: "medium",
    topic: "ages",
    question: "A father is 3 times as old as his son. After 15 years, he will be twice as old. What is the son's current age?",
    options: ["10 years", "12 years", "15 years", "18 years"],
    correctAnswer: 2,
    explanation: "Let son's age = x. Father = 3x. After 15 years: 3x+15 = 2(x+15). Solving: x = 15"
  },
  {
    id: "quant-018",
    category: "quantitative",
    difficulty: "easy",
    topic: "lcm-hcf",
    question: "What is the LCM of 12 and 18?",
    options: ["36", "48", "54", "72"],
    correctAnswer: 0,
    explanation: "Prime factorization: 12 = 2² × 3, 18 = 2 × 3². LCM = 2² × 3² = 36"
  },
  {
    id: "quant-019",
    category: "quantitative",
    difficulty: "hard",
    topic: "pipes-cisterns",
    question: "Pipe A fills a tank in 6 hours, Pipe B empties it in 8 hours. If both are opened together, how long to fill?",
    options: ["20 hours", "22 hours", "24 hours", "26 hours"],
    correctAnswer: 2,
    explanation: "Net filling rate = 1/6 - 1/8 = 1/24 per hour. Time = 24 hours"
  },
  {
    id: "quant-020",
    category: "quantitative",
    difficulty: "medium",
    topic: "data-interpretation",
    question: "If 20% of a number is 50, what is 30% of that number?",
    options: ["60", "65", "70", "75"],
    correctAnswer: 3,
    explanation: "If 20% = 50, then 100% = 250. So 30% = 0.3 × 250 = 75"
  }
]

export const verbalAbilityQuestions: AptitudeQuestion[] = [
  {
    id: "verb-001",
    category: "verbal",
    difficulty: "easy",
    topic: "synonyms",
    question: "Choose the word most similar in meaning to 'BRAVE':",
    options: ["Cowardly", "Courageous", "Timid", "Fearful"],
    correctAnswer: 1,
    explanation: "Courageous is a synonym of brave, both meaning showing courage"
  },
  {
    id: "verb-002",
    category: "verbal",
    difficulty: "easy",
    topic: "antonyms",
    question: "Choose the word opposite in meaning to 'ANCIENT':",
    options: ["Old", "Modern", "Historic", "Antique"],
    correctAnswer: 1,
    explanation: "Modern is the antonym of ancient, representing contemporary or recent times"
  },
  {
    id: "verb-003",
    category: "verbal",
    difficulty: "medium",
    topic: "idioms",
    question: "What does 'A piece of cake' mean?",
    options: ["Something delicious", "Something easy", "Something expensive", "Something sweet"],
    correctAnswer: 1,
    explanation: "The idiom 'a piece of cake' means something that is very easy to do"
  },
  {
    id: "verb-004",
    category: "verbal",
    difficulty: "easy",
    topic: "grammar",
    question: "Choose the correct sentence:",
    options: ["She don't like pizza", "She doesn't likes pizza", "She doesn't like pizza", "She don't likes pizza"],
    correctAnswer: 2,
    explanation: "With singular third person (she), we use 'doesn't' and the base form of the verb"
  },
  {
    id: "verb-005",
    category: "verbal",
    difficulty: "medium",
    topic: "sentence-correction",
    question: "Identify the error: 'Neither of the students have completed their homework.'",
    options: ["Neither", "have", "their", "No error"],
    correctAnswer: 1,
    explanation: "'Neither' is singular and requires 'has' instead of 'have'"
  },
  {
    id: "verb-006",
    category: "verbal",
    difficulty: "hard",
    topic: "vocabulary",
    question: "What does 'EPHEMERAL' mean?",
    options: ["Lasting for a very short time", "Extremely large", "Very beautiful", "Highly intelligent"],
    correctAnswer: 0,
    explanation: "Ephemeral means lasting for a very short time, transitory"
  },
  {
    id: "verb-007",
    category: "verbal",
    difficulty: "easy",
    topic: "spellings",
    question: "Choose the correctly spelled word:",
    options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
    correctAnswer: 1,
    explanation: "The correct spelling is 'accommodate' with double 'c' and double 'm'"
  },
  {
    id: "verb-008",
    category: "verbal",
    difficulty: "medium",
    topic: "one-word-substitution",
    question: "A person who loves books:",
    options: ["Bibliophile", "Bibliophobe", "Librarian", "Author"],
    correctAnswer: 0,
    explanation: "A bibliophile is a person who loves or collects books"
  },
  {
    id: "verb-009",
    category: "verbal",
    difficulty: "hard",
    topic: "reading-comprehension",
    question: "Passage: 'The cat sat on the mat, watching the birds fly by. It wished it could fly too.' What was the cat doing?",
    options: ["Sleeping", "Eating", "Watching birds", "Playing"],
    correctAnswer: 2,
    explanation: "The passage clearly states the cat was 'watching the birds fly by'"
  },
  {
    id: "verb-010",
    category: "verbal",
    difficulty: "easy",
    topic: "articles",
    question: "Fill in the blank: 'She is ___ honest person.'",
    options: ["a", "an", "the", "no article"],
    correctAnswer: 1,
    explanation: "We use 'an' before words starting with a vowel sound. 'Honest' has a silent 'h'"
  },
  {
    id: "verb-011",
    category: "verbal",
    difficulty: "medium",
    topic: "prepositions",
    question: "Choose the correct preposition: 'She is good ___ mathematics.'",
    options: ["in", "at", "on", "with"],
    correctAnswer: 1,
    explanation: "We use 'good at' when referring to skills or abilities"
  },
  {
    id: "verb-012",
    category: "verbal",
    difficulty: "hard",
    topic: "analogy",
    question: "Complete: Doctor : Hospital :: Teacher : ?",
    options: ["Student", "School", "Book", "Classroom"],
    correctAnswer: 1,
    explanation: "A doctor works in a hospital, similarly a teacher works in a school"
  },
  {
    id: "verb-013",
    category: "verbal",
    difficulty: "easy",
    topic: "tenses",
    question: "Choose the correct form: 'I ___ to the store yesterday.'",
    options: ["go", "goes", "went", "going"],
    correctAnswer: 2,
    explanation: "'Went' is the past tense of 'go', used with the time indicator 'yesterday'"
  },
  {
    id: "verb-014",
    category: "verbal",
    difficulty: "medium",
    topic: "active-passive",
    question: "Change to passive: 'The teacher teaches the students.'",
    options: ["The students are taught by the teacher", "The students were taught by the teacher", "The students teach the teacher", "The teacher is taught by students"],
    correctAnswer: 0,
    explanation: "In passive voice, the object becomes the subject: 'The students are taught by the teacher'"
  },
  {
    id: "verb-015",
    category: "verbal",
    difficulty: "hard",
    topic: "contextual-meaning",
    question: "In 'He was feeling blue', what does 'blue' mean?",
    options: ["The color blue", "Sad or depressed", "Cold", "Angry"],
    correctAnswer: 1,
    explanation: "'Feeling blue' is an idiom meaning feeling sad or depressed"
  },
  {
    id: "verb-016",
    category: "verbal",
    difficulty: "easy",
    topic: "fill-in-blanks",
    question: "The sun ___ in the east.",
    options: ["rise", "rises", "rising", "risen"],
    correctAnswer: 1,
    explanation: "We use simple present tense with 's' for universal truths with singular subjects"
  },
  {
    id: "verb-017",
    category: "verbal",
    difficulty: "medium",
    topic: "Para-jumbles",
    question: "Arrange: (A) the world (B) technology (C) has changed (D) rapidly. Correct order:",
    options: ["ABCD", "BCAD", "BADC", "BDCA"],
    correctAnswer: 2,
    explanation: "The correct sentence is: 'Technology has changed the world rapidly' (BADC)"
  },
  {
    id: "verb-018",
    category: "verbal",
    difficulty: "hard",
    topic: "critical-reasoning",
    question: "All birds can fly. Penguins are birds. Therefore:",
    options: ["Penguins can fly", "The premise is false", "Penguins cannot swim", "All of these"],
    correctAnswer: 1,
    explanation: "The first premise is false because not all birds can fly (e.g., penguins, ostriches)"
  },
  {
    id: "verb-019",
    category: "verbal",
    difficulty: "easy",
    topic: "word-usage",
    question: "Which word is used correctly? 'I am ___ to meet you.'",
    options: ["eager", "anxious", "both", "neither"],
    correctAnswer: 0,
    explanation: "'Eager' is correct for positive anticipation, while 'anxious' implies worry"
  },
  {
    id: "verb-020",
    category: "verbal",
    difficulty: "medium",
    topic: "sentence-improvement",
    question: "Improve: 'He is more smarter than his brother.'",
    options: ["He is smarter than his brother", "He is most smarter than his brother", "He is more smart than his brother", "No improvement needed"],
    correctAnswer: 0,
    explanation: "We don't use 'more' with comparative adjectives ending in '-er'. Use either 'smarter' or 'more smart'"
  }
]

export const questionPools = {
  logical: logicalReasoningQuestions,
  quantitative: quantitativeQuestions,
  verbal: verbalAbilityQuestions
}

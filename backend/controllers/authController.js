const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Activity = require('../models/Activity');
const { validateRegisterPayload, validateLoginPayload } = require('../utils/validation');

// Advanced Placement Readiness Score Calculator
const computeReadiness = (user, topics, mockPerformance) => {
  const dsaTopics = topics.filter(t => t.category === 'DSA');
  const javaTopics = topics.filter(t => t.category === 'Java');
  const sqlTopics = topics.filter(t => t.category === 'SQL');
  const aptitudeTopics = topics.filter(t => t.category === 'Aptitude');

  const getAvgProgress = (list) => {
    if (!list.length) return 0;
    const total = list.reduce((sum, t) => sum + (t.progressPercentage || 0), 0);
    return Math.round(total / list.length);
  };

  const dsaProgress = getAvgProgress(dsaTopics);
  const javaProgress = getAvgProgress(javaTopics);
  const sqlProgress = getAvgProgress(sqlTopics);
  const aptitudeProgress = getAvgProgress(aptitudeTopics);

  const mockScore = mockPerformance || user.mockInterviewScore || 0;
  const consistencyScore = Math.min(100, Math.max(0, user.streak) * 10);

  const weightedScore = Math.min(100, Math.round(
    dsaProgress * 0.40 +
    javaProgress * 0.20 +
    sqlProgress * 0.15 +
    mockScore * 0.15 +
    consistencyScore * 0.10
  ));

  return {
    overall: weightedScore,
    breakdown: {
      dsa: dsaProgress,
      java: javaProgress,
      sql: sqlProgress,
      aptitude: aptitudeProgress,
      mock: mockScore,
      consistency: consistencyScore
    }
  };
};

// Seeding 40 starter topics + flashcards on registration
const createStarterData = async (userId) => {
  const starterTopics = [
    // DSA (12 topics)
    { userId, topicName: 'Arrays', category: 'DSA', difficulty: 'Easy', totalQuestions: 15, notes: 'Two-pointer, sliding window patterns.', flashcards: [
      { question: 'What is a sliding window?', answer: 'A sub-array tracking method using two pointers to represent a range.' }
    ]},
    { userId, topicName: 'Strings', category: 'DSA', difficulty: 'Easy', totalQuestions: 15, notes: 'Substring search, palindrome check, anagrams.', flashcards: [
      { question: 'How do you check if two strings are anagrams?', answer: 'Sort both strings and compare them, or count characters using a frequency map.' }
    ]},
    { userId, topicName: 'Linked Lists', category: 'DSA', difficulty: 'Medium', totalQuestions: 10, notes: 'Singly, Doubly, Loop detection (Floyd\'s algorithm).', flashcards: [
      { question: 'How do you detect a loop in a Linked List?', answer: 'Use Floyd\'s Cycle Finding Algorithm with a slow pointer (1 step) and fast pointer (2 steps).' }
    ]},
    { userId, topicName: 'Stack', category: 'DSA', difficulty: 'Medium', totalQuestions: 10, notes: 'LIFO structures, monotonic stacks, balanced parentheses.', flashcards: [
      { question: 'What is a Monotonic Stack?', answer: 'A stack that keeps elements in sorted order (increasing or decreasing).' }
    ]},
    { userId, topicName: 'Queue', category: 'DSA', difficulty: 'Medium', totalQuestions: 10, notes: 'FIFO structures, BFS queue implementation.', flashcards: [
      { question: 'What is the main difference between Stack and Queue?', answer: 'Stack is LIFO (Last In First Out); Queue is FIFO (First In First Out).' }
    ]},
    { userId, topicName: 'Trees', category: 'DSA', difficulty: 'Hard', totalQuestions: 12, notes: 'BST, DFS traversals (pre, in, post order), lowest common ancestor.', flashcards: [
      { question: 'What is the Inorder traversal of a BST?', answer: 'A traversal that visits nodes in ascending sorted order.' }
    ]},
    { userId, topicName: 'Graphs', category: 'DSA', difficulty: 'Hard', totalQuestions: 12, notes: 'BFS/DFS traversals, Dijkstra\'s algorithm, topological sort.', flashcards: [
      { question: 'When is Topological Sort used?', answer: 'To order vertices in a Directed Acyclic Graph (DAG) based on dependency precedence.' }
    ]},
    { userId, topicName: 'Binary Search', category: 'DSA', difficulty: 'Medium', totalQuestions: 10, notes: 'Divide and conquer search on sorted ranges.', flashcards: [
      { question: 'What is the time complexity of Binary Search?', answer: 'O(log N) because the search space is halved in each step.' }
    ]},
    { userId, topicName: 'Heap', category: 'DSA', difficulty: 'Medium', totalQuestions: 8, notes: 'Min/Max heaps, priority queues, k-way merges.', flashcards: [
      { question: 'What is the insertion time complexity in a binary heap?', answer: 'O(log N) due to bubble-up heapify operations.' }
    ]},
    { userId, topicName: 'Greedy', category: 'DSA', difficulty: 'Medium', totalQuestions: 8, notes: 'Locally optimal choices (Interval scheduling, Huffman coding).', flashcards: [
      { question: 'What is the core principle of a Greedy algorithm?', answer: 'Make the best local choice at each step to reach a global optimum.' }
    ]},
    { userId, topicName: 'Backtracking', category: 'DSA', difficulty: 'Hard', totalQuestions: 8, notes: 'State-space tree traversal (N-Queens, Sudoku solver).', flashcards: [
      { question: 'What is backtracking?', answer: 'A recursive algorithm search technique that rolls back choices when a path fails.' }
    ]},
    { userId, topicName: 'Dynamic Programming', category: 'DSA', difficulty: 'Hard', totalQuestions: 15, notes: 'Memoization vs Tabulation, knapsack, LCS.', flashcards: [
      { question: 'What is the difference between Memoization and Tabulation?', answer: 'Memoization is Top-Down (caching recursion); Tabulation is Bottom-Up (filling arrays iteratively).' }
    ]},

    // Core Java (15 topics)
    { userId, topicName: 'OOP', category: 'Java', difficulty: 'Medium', notes: 'Inheritance, Polymorphism, Abstraction, Encapsulation.', flashcards: [
      { question: 'What are the 4 pillars of OOP?', answer: 'Encapsulation, Inheritance, Polymorphism, and Abstraction.' }
    ]},
    { userId, topicName: 'Inheritance', category: 'Java', difficulty: 'Easy', notes: 'IS-A relationship, super keyword, method overriding.', flashcards: [
      { question: 'Does Java support multiple inheritance of classes?', answer: 'No, to avoid ambiguity (the Diamond Problem). Interfaces can support multiple inheritance.' }
    ]},
    { userId, topicName: 'Polymorphism', category: 'Java', difficulty: 'Medium', notes: 'Compile-time (Overloading) vs Runtime (Overriding).', flashcards: [
      { question: 'What is dynamic method dispatch?', answer: 'A process in which an overridden method call is resolved at runtime using the reference variable.' }
    ]},
    { userId, topicName: 'Abstraction', category: 'Java', difficulty: 'Easy', notes: 'Abstract classes and Interfaces.', flashcards: [
      { question: 'Can we create an instance of an abstract class?', answer: 'No, abstract classes cannot be directly instantiated.' }
    ]},
    { userId, topicName: 'Encapsulation', category: 'Java', difficulty: 'Easy', notes: 'Data hiding with private members and getters/setters.', flashcards: [
      { question: 'How is encapsulation achieved in Java?', answer: 'Declare variables private and expose them via public getters and setters.' }
    ]},
    { userId, topicName: 'Collections Framework', category: 'Java', difficulty: 'Medium', notes: 'List, Set, Map hierarchies, hashing.', flashcards: [
      { question: 'What is the difference between List and Set?', answer: 'List permits duplicate elements and maintains order; Set disallows duplicate elements.' }
    ]},
    { userId, topicName: 'Exception Handling', category: 'Java', difficulty: 'Easy', notes: 'Checked vs Unchecked exception hierarchies, try-catch-finally.', flashcards: [
      { question: 'What does the finally block do?', answer: 'Guarantees execution of cleanup code, regardless of whether an exception was thrown or caught.' }
    ]},
    { userId, topicName: 'Multithreading', category: 'Java', difficulty: 'Hard', notes: 'Thread lifecycle, synchronization, executors.', flashcards: [
      { question: 'What does the synchronized keyword do?', answer: 'Restricts thread access to a block or method to only one thread at a time.' }
    ]},
    { userId, topicName: 'JVM', category: 'Java', difficulty: 'Hard', notes: 'Classloader, heap/stack areas, JIT compilation.', flashcards: [
      { question: 'What does JIT stand for in JVM?', answer: 'Just-In-Time compiler. It compiles bytecode into native machine code at runtime.' }
    ]},
    { userId, topicName: 'JDK vs JRE', category: 'Java', difficulty: 'Easy', notes: 'JDK = JRE + Developer tools, JRE = JVM + libraries.', flashcards: [
      { question: 'Which one is required to run a Java program: JDK or JRE?', answer: 'JRE (Java Runtime Environment) is sufficient to run; JDK is needed to compile.' }
    ]},
    { userId, topicName: 'Garbage Collection', category: 'Java', difficulty: 'Hard', notes: 'Mark-and-sweep, generational GC, system.gc().', flashcards: [
      { question: 'Can we force garbage collection in Java?', answer: 'No, calling System.gc() only suggests compilation execution to the JVM.' }
    ]},
    { userId, topicName: 'Streams API', category: 'Java', difficulty: 'Medium', notes: 'Functional interfaces, map/filter/reduce pipelines.', flashcards: [
      { question: 'What is a terminal stream operation?', answer: 'An operation (like collect or foreach) that processes pipeline streams to produce values.' }
    ]},
    { userId, topicName: 'Generics', category: 'Java', difficulty: 'Medium', notes: 'Type safety, type erasure, wildcards.', flashcards: [
      { question: 'What is Type Erasure?', answer: 'The compiler process of removing all generic type parameters during byte code generation.' }
    ]},
    { userId, topicName: 'File Handling', category: 'Java', difficulty: 'Easy', notes: 'Streams, readers/writers, NIO.', flashcards: [
      { question: 'Which package is used for modern file processing?', answer: 'java.nio (Non-blocking I/O).' }
    ]},
    { userId, topicName: 'Serialization', category: 'Java', difficulty: 'Medium', notes: 'Serializable interface, transient fields.', flashcards: [
      { question: 'What is the purpose of the transient keyword?', answer: 'Prevents fields from being serialized during object writing.' }
    ]},

    // SQL (10 topics)
    { userId, topicName: 'Constraints', category: 'SQL', difficulty: 'Easy', notes: 'Primary, Foreign, Unique, Default checks.', flashcards: [
      { question: 'Can a table have multiple Unique keys?', answer: 'Yes, but a table can have only one Primary Key.' }
    ]},
    { userId, topicName: 'Keys', category: 'SQL', difficulty: 'Easy', notes: 'Primary, composite, foreign, surrogate.', flashcards: [
      { question: 'What is a Foreign Key?', answer: 'A field in a table that uniquely identifies a row of another table.' }
    ]},
    { userId, topicName: 'Joins', category: 'SQL', difficulty: 'Medium', notes: 'Inner, Left, Right, Full Outer, Self Joins.', flashcards: [
      { question: 'What is a Self Join?', answer: 'A regular join operation where a table is joined with itself.' }
    ]},
    { userId, topicName: 'Subqueries', category: 'SQL', difficulty: 'Medium', notes: 'Correlated vs Nested, EXISTS vs IN.', flashcards: [
      { question: 'What is a Correlated Subquery?', answer: 'A subquery that evaluates once for each row evaluated by the outer query.' }
    ]},
    { userId, topicName: 'Normalization', category: 'SQL', difficulty: 'Hard', notes: '1NF, 2NF, 3NF, BCNF rules.', flashcards: [
      { question: 'What is 3NF?', answer: 'A table in 2NF where no transitive dependencies exist between non-prime attributes.' }
    ]},
    { userId, topicName: 'Views', category: 'SQL', difficulty: 'Easy', notes: 'Virtual tables, materialized views.', flashcards: [
      { question: 'Is a standard SQL view physically stored on disk?', answer: 'No, it is a virtual query definition. Materialized views are stored.' }
    ]},
    { userId, topicName: 'Indexes', category: 'SQL', difficulty: 'Medium', notes: 'Clustered vs Non-clustered index, query speed.', flashcards: [
      { question: 'What is the main drawback of indexes?', answer: 'They slow down insert, update, and delete operations (DML).' }
    ]},
    { userId, topicName: 'Stored Procedures', category: 'SQL', difficulty: 'Medium', notes: 'Precompiled SQL scripts, input/output variables.', flashcards: [
      { question: 'Why use a Stored Procedure?', answer: 'Improves performance via precompilation and reduces network traffic.' }
    ]},
    { userId, topicName: 'Triggers', category: 'SQL', difficulty: 'Hard', notes: 'Row level events, BEFORE/AFTER updates.', flashcards: [
      { question: 'What is an SQL Trigger?', answer: 'A named database object that compiles automatically when DML events occur.' }
    ]},
    { userId, topicName: 'Transactions', category: 'SQL', difficulty: 'Hard', notes: 'ACID properties, commit/rollback, isolation.', flashcards: [
      { question: 'What are the ACID properties?', answer: 'Atomicity, Consistency, Isolation, and Durability.' }
    ]},

    // Aptitude (3 topics)
    { userId, topicName: 'Quantitative Aptitude', category: 'Aptitude', difficulty: 'Medium', notes: 'Time & work, ratios, interest, percentages.', flashcards: [
      { question: 'How is efficiency related to time?', answer: 'Efficiency is inversely proportional to time taken.' }
    ]},
    { userId, topicName: 'Logical Reasoning', category: 'Aptitude', difficulty: 'Medium', notes: 'Blood relations, seating, syllogisms.', flashcards: [
      { question: 'What is a syllogism?', answer: 'A logical argument where a conclusion is drawn from two given propositions.' }
    ]},
    { userId, topicName: 'Verbal Ability', category: 'Aptitude', difficulty: 'Easy', notes: 'Grammar, sentence completion, reading comprehension.', flashcards: [
      { question: 'What is an antonym?', answer: 'A word that means the opposite of another word.' }
    ]}
  ];

  await Topic.insertMany(starterTopics);
};

// POST /api/auth/register
const register = async (req, res) => {
  const { fullName, email, password, college, branch, role, graduationYear } = req.body;
  console.log('[AUTH REGISTER] incoming payload:', {
    fullName,
    email,
    college,
    branch,
    role,
    graduationYear
  });

  const validationError = validateRegisterPayload({ fullName, email, password, college, branch, role, graduationYear });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      passwordHash,
      college,
      branch,
      role,
      graduationYear,
      streak: 0,
      xp: 0,
      level: 1,
      achievements: [],
      readinessScore: 0
    });

    // Seed the database topics & flashcards for this specific user (non-fatal)
    try {
      await createStarterData(user._id);
    } catch (seedErr) {
      console.warn('[WARN] Starter data seeding failed:', seedErr.message);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        college: user.college,
        branch: user.branch,
        role: user.role,
        graduationYear: user.graduationYear,
        joinedAt: user.joinedAt,
        streak: user.streak,
        xp: user.xp,
        level: user.level,
        achievements: user.achievements,
        readinessScore: user.readinessScore
      },
      welcomeMessage: 'Welcome to your Interview Preparation cockpit. Your placement metrics are live.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  const validationError = validateLoginPayload({ email, password });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Update streak if needed (basic login logic check)
    const today = new Date();
    const lastActive = new Date(user.lastActiveDate);
    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    user.lastActiveDate = today;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        college: user.college,
        branch: user.branch,
        role: user.role,
        graduationYear: user.graduationYear,
        joinedAt: user.joinedAt,
        streak: user.streak,
        xp: user.xp,
        level: user.level,
        achievements: user.achievements,
        readinessScore: user.readinessScore
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

// GET /api/auth/profile
const profile = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(404).json({ error: 'User not found.' });

  try {
    const topics = await Topic.find({ userId: user._id });
    const activities = await Activity.find({ userId: user._id }).sort({ date: -1 }).limit(6);
    const applications = await Application.find({ userId: user._id });
    const interviews = await Interview.find({ userId: user._id });

    // Calculate readiness score breakdown
    const mockInterviewScore = user.mockInterviewScore || 0;
    const readinessInfo = computeReadiness(user, topics, mockInterviewScore);

    // Save readiness score to database if changed
    if (user.readinessScore !== readinessInfo.overall) {
      user.readinessScore = readinessInfo.overall;
      await user.save();
    }

    const resumeItems = [
      { label: 'Resume Uploaded', completed: user.resumeUploaded },
      { label: 'LinkedIn Updated', completed: user.linkedinUpdated },
      { label: 'GitHub Updated', completed: user.githubUpdated },
      { label: 'Portfolio Created', completed: user.portfolioCreated }
    ];

    res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        college: user.college,
        branch: user.branch,
        role: user.role,
        graduationYear: user.graduationYear,
        joinedAt: user.joinedAt,
        streak: user.streak,
        xp: user.xp,
        level: user.level,
        achievements: user.achievements,
        readinessScore: readinessInfo.overall,
        mockInterviewScore: user.mockInterviewScore
      },
      readinessBreakdown: readinessInfo.breakdown,
      summary: {
        topicsCount: topics.length,
        totalSolved: topics.reduce((sum, t) => sum + (t.solvedQuestions || 0), 0),
        currentStreak: user.streak,
        applicationsCount: applications.length,
        interviewsCount: interviews.length
      },
      resumeReadiness: {
        checklist: resumeItems,
        completed: resumeItems.filter(i => i.completed).length,
        total: resumeItems.length
      },
      recentActivity: activities
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile: ' + error.message });
  }
};

// PATCH /api/auth/profile
const updateProfile = async (req, res) => {
  const updates = {};
  const editableFields = [
    'fullName', 'college', 'branch', 'role', 'graduationYear',
    'resumeUploaded', 'linkedinUpdated', 'githubUpdated', 'portfolioCreated'
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No editable fields provided.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
    if (!updatedUser) return res.status(404).json({ error: 'User not found.' });

    res.json({
      message: 'Profile updated successfully.',
      user: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        college: updatedUser.college,
        branch: updatedUser.branch,
        role: updatedUser.role,
        graduationYear: updatedUser.graduationYear,
        joinedAt: updatedUser.joinedAt,
        streak: updatedUser.streak,
        xp: updatedUser.xp,
        level: updatedUser.level,
        achievements: updatedUser.achievements,
        readinessScore: updatedUser.readinessScore,
        resumeUploaded: updatedUser.resumeUploaded,
        linkedinUpdated: updatedUser.linkedinUpdated,
        githubUpdated: updatedUser.githubUpdated,
        portfolioCreated: updatedUser.portfolioCreated
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed: ' + error.message });
  }
};

// GET /api/auth/leaderboard
const leaderboard = async (req, res) => {
  try {
    const usersList = await User.find({})
      .sort({ xp: -1 })
      .select('fullName email college xp level achievements')
      .limit(50);
    res.json(usersList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard: ' + error.message });
  }
};

// POST /api/auth/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  try {
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Password change failed: ' + error.message });
  }
};

module.exports = { register, login, profile, updateProfile, leaderboard, changePassword };

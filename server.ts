import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("skillup.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    current_module_id INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    "order" INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    FOREIGN KEY (module_id) REFERENCES modules (id)
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    user_id INTEGER,
    module_id INTEGER,
    score INTEGER,
    passed BOOLEAN DEFAULT 0,
    PRIMARY KEY (user_id, module_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (module_id) REFERENCES modules (id)
  );
`);

// Seed Data
const seedModules = [
  { id: 1, title: "Building Confidence", video_url: "7e6RSGdvHD8", order: 1 },
  { id: 2, title: "Professional Communication", video_url: "WESGDi_ajUU", order: 2 },
  { id: 3, title: "Interview Preparation", video_url: "LCWr-TJrc0k", order: 3 },
  { id: 4, title: "Resume Basics", video_url: "u75hUSShvnc", order: 4 },
  { id: 5, title: "Workplace Behaviour", video_url: "6Z6BE7gmlGw", order: 5 }
];

const insertModule = db.prepare('INSERT OR REPLACE INTO modules (id, title, video_url, "order") VALUES (?, ?, ?, ?)');
seedModules.forEach(m => insertModule.run(m.id, m.title, m.video_url, m.order));

const seedQuizzes = [
  // Module 1
  { module_id: 1, question: "According to the video, confidence improves when you:", options: ["Avoid difficult situations", "Take action despite fear", "Wait until you feel ready", "Compare yourself to others"], correct: "B" },
  { module_id: 1, question: "A major reason people lack confidence is:", options: ["Lack of intelligence", "Fear of failure and judgment", "Not having enough friends", "Speaking softly"], correct: "B" },
  { module_id: 1, question: "Which body language shows confidence?", options: ["Avoiding eye contact", "Standing straight and maintaining eye contact", "Looking at the floor", "Crossing arms tightly"], correct: "B" },
  { module_id: 1, question: "Confidence grows through:", options: ["Practice and repetition", "Natural talent only", "Compliments", "Luck"], correct: "A" },
  { module_id: 1, question: "Confidence is:", options: ["Fixed at birth", "A skill that can be developed", "Only for leaders", "Based on appearance"], correct: "B" },
  // Module 2
  { module_id: 2, question: "Professional communication requires:", options: ["Respect and clarity", "Slang", "Loud speech", "Interrupting"], correct: "A" },
  { module_id: 2, question: "Active listening means:", options: ["Waiting to speak", "Fully focusing before responding", "Speaking quickly", "Ignoring body language"], correct: "B" },
  { module_id: 2, question: "Which damages workplace communication?", options: ["Gossip", "Asking questions", "Clear explanations", "Respect"], correct: "A" },
  { module_id: 2, question: "Tone of voice affects:", options: ["Nothing", "Only volume", "How your message is understood", "Your clothes"], correct: "C" },
  { module_id: 2, question: "Body language is:", options: ["Not important", "A key part of communication", "Only for interviews", "Optional"], correct: "B" },
  // Module 3
  { module_id: 3, question: "The purpose of an interview is to:", options: ["Judge appearance", "See if you fit the role", "Test memory", "Make you nervous"], correct: "B" },
  { module_id: 3, question: "Before an interview, you should:", options: ["Research the company", "Arrive late", "Guess information", "Avoid preparation"], correct: "A" },
  { module_id: 3, question: "When answering questions, you should:", options: ["Be clear and structured", "Speak randomly", "Give one-word answers", "Talk about unrelated topics"], correct: "A" },
  { module_id: 3, question: "Good interview posture includes:", options: ["Slouching", "Looking at your phone", "Sitting upright and attentive", "Avoiding eye contact"], correct: "C" },
  { module_id: 3, question: "You should never:", options: ["Prepare", "Ask questions", "Speak respectfully", "Criticize previous employers"], correct: "D" },
  // Module 4
  { module_id: 4, question: "The main goal of a resume is to:", options: ["Get you an interview", "Share your life story", "Show hobbies only", "Impress friends"], correct: "A" },
  { module_id: 4, question: "A resume should be:", options: ["Clear and concise", "5 pages long", "Casual", "Colorful with emojis"], correct: "A" },
  { module_id: 4, question: "Which is essential in a resume?", options: ["Work experience", "Political opinions", "Drama", "Family details"], correct: "A" },
  { module_id: 4, question: "Skills on a resume should be:", options: ["Relevant to the job", "Random", "Exaggerated", "Hidden"], correct: "A" },
  { module_id: 4, question: "Spelling mistakes:", options: ["Do not matter", "Reduce credibility", "Are acceptable", "Improve creativity"], correct: "B" },
  // Module 5
  { module_id: 5, question: "Being punctual shows:", options: ["Laziness", "Responsibility", "Fear", "Weakness"], correct: "B" },
  { module_id: 5, question: "If you make a mistake:", options: ["Hide it", "Blame others", "Admit and fix it", "Ignore it"], correct: "C" },
  { module_id: 5, question: "Teamwork requires:", options: ["Silence", "Cooperation", "Competition only", "Isolation"], correct: "B" },
  { module_id: 5, question: "Professional behavior includes:", options: ["Respect", "Gossip", "Arguing loudly", "Ignoring rules"], correct: "A" },
  { module_id: 5, question: "Workplace attitude affects:", options: ["Nothing", "Career growth", "Only salary", "Only coworkers"], correct: "B" }
];

const insertQuiz = db.prepare('INSERT OR REPLACE INTO quizzes (module_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)');
// Clear existing quizzes to avoid duplicates on restart if needed, or just use REPLACE
db.exec("DELETE FROM quizzes");
seedQuizzes.forEach(q => insertQuiz.run(q.module_id, q.question, q.options[0], q.options[1], q.options[2], q.options[3], q.correct));

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Name and phone required" });

    let user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone) as any;
    if (!user) {
      const result = db.prepare("INSERT INTO users (name, phone) VALUES (?, ?)").run(name, phone);
      user = { id: result.lastInsertRowid, name, phone, current_module_id: 1 };
    }
    res.json(user);
  });

  app.get("/api/modules", (req, res) => {
    const userId = req.query.userId;
    const modules = db.prepare(`
      SELECT m.*, p.passed, p.score
      FROM modules m
      LEFT JOIN user_progress p ON m.id = p.module_id AND p.user_id = ?
      ORDER BY m."order" ASC
    `).all(userId);
    res.json(modules);
  });

  app.get("/api/modules/:id", (req, res) => {
    const module = db.prepare("SELECT * FROM modules WHERE id = ?").get(req.params.id);
    const questions = db.prepare("SELECT * FROM quizzes WHERE module_id = ?").all(req.params.id);
    res.json({ ...module, questions });
  });

  app.post("/api/quiz/submit", (req, res) => {
    const { userId, moduleId, answers } = req.body;
    const questions = db.prepare("SELECT id, correct_answer FROM quizzes WHERE module_id = ?").all(moduleId) as any[];
    
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) score++;
    });

    const passed = score >= 4; // 80% of 5 is 4

    db.prepare(`
      INSERT OR REPLACE INTO user_progress (user_id, module_id, score, passed)
      VALUES (?, ?, ?, ?)
    `).run(userId, moduleId, score, passed ? 1 : 0);

    if (passed) {
      const nextModuleId = parseInt(moduleId) + 1;
      const nextModule = db.prepare("SELECT id FROM modules WHERE id = ?").get(nextModuleId);
      if (nextModule) {
        db.prepare("UPDATE users SET current_module_id = MAX(current_module_id, ?) WHERE id = ?").run(nextModuleId, userId);
      }
    }

    res.json({ score, passed });
  });

  app.get("/api/user/:id", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    const progress = db.prepare("SELECT COUNT(*) as completed FROM user_progress WHERE user_id = ? AND passed = 1").get(req.params.id) as any;
    const total = db.prepare("SELECT COUNT(*) as total FROM modules").get() as any;
    
    res.json({ 
      ...user, 
      completedCount: progress.completed, 
      totalModules: total.total,
      percentage: Math.round((progress.completed / total.total) * 100)
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

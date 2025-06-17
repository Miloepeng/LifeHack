# AI Learning Platform

A comprehensive AI-powered learning platform built with Next.js, TypeScript, and Supabase. Features role-based authentication for students and teachers, interactive question types, and real-time analytics.

## 🚀 Features

### For Students
- **Subject Selection**: Choose from multiple subjects to learn
- **Interactive Questions**: Three question types:
  - Multiple Choice
  - True/False  
  - Short Answer
- **Progress Tracking**: Real-time progress monitoring and accuracy tracking
- **Personalized Dashboard**: View learning progress across subjects

### For Teachers
- **Class Analytics**: Monitor overall class performance
- **Student Progress**: Track individual student progress
- **Subject Performance**: View performance metrics by subject
- **Real-time Dashboard**: Live updates on student activity

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with role-based access
- **Database**: PostgreSQL with Row Level Security

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LifeHack/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The environment variables are already configured in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyoeyjwwjpqtiwizqmcu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5b2V5and3anBxdGl3aXpxbWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTcxNzgsImV4cCI6MjA2NTczMzE3OH0.wq8x2uBFXunv8M1MlqRTeC6hZmT_WqabwNx_ORZFwtc
   ```

4. **Database Setup**
   
   Run the SQL schema in your Supabase SQL Editor:
   ```bash
   # The database schema is in database-schema.sql
   # Copy and paste the contents into Supabase SQL Editor
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User profiles with role-based access (student/teacher)
- **subjects**: Learning subjects (Math, Science, English, etc.)
- **questions**: Questions with multiple types and difficulty levels
- **student_answers**: Student responses to questions
- **student_progress**: Aggregated progress tracking per subject

## 🔐 Authentication & Authorization

### User Roles
- **Students**: Can view subjects, answer questions, track progress
- **Teachers**: Can view all student data, analytics, and class performance

### Security Features
- Row Level Security (RLS) policies
- Role-based access control
- Secure authentication with Supabase Auth

## 🎯 Usage

### For Students
1. **Sign Up**: Create an account and select "Student" role
2. **Login**: Sign in to access your dashboard
3. **Choose Subject**: Select a subject to start learning
4. **Answer Questions**: Complete questions and track your progress
5. **View Progress**: Monitor your accuracy and learning streaks

### For Teachers
1. **Sign Up**: Create an account and select "Teacher" role
2. **Login**: Access the teacher dashboard
3. **Monitor Class**: View class-wide performance metrics
4. **Track Students**: See individual student progress
5. **Analyze Performance**: Review subject-wise analytics

## 📱 Question Types

### 1. Multiple Choice
- 4 answer options
- Single correct answer
- Visual feedback on selection

### 2. True/False
- Binary choice questions
- Large interactive buttons
- Clear correct/incorrect indication

### 3. Short Answer
- Text input responses
- Case-insensitive matching
- Immediate feedback

## 📊 Analytics Features

### Student Analytics
- Questions answered per subject
- Accuracy percentages
- Learning streaks
- Time spent learning

### Teacher Analytics
- Class overview statistics
- Top performing students
- Subject performance comparison
- Recent student activity

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── learn/            # Learning interface
│   └── login/            # Authentication
├── components/           # Reusable components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   ├── questions/       # Question type components
│   └── ui/              # UI primitives
├── hooks/               # Custom React hooks
└── lib/                 # Utilities and configurations
```

### Key Files
- `src/lib/supabase.ts`: Supabase client and type definitions
- `src/hooks/useAuth.tsx`: Authentication context and hooks
- `database-schema.sql`: Complete database schema with sample data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the database schema
- Ensure environment variables are correctly set
- Verify Supabase configuration

---

Built with ❤️ using Next.js, TypeScript, and Supabase.

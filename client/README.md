# AI Learning Platform

A comprehensive AI-powered learning platform built with Next.js, TypeScript, and Supabase. Designed to personalise learning for every student while giving teachers the insights they need to guide growth. We built this for the LifeHack Hackathon 2025 with a focus on Primary-level learners and future scalability. 

## Features

### For Students
- **Subject Selection**: Choose from multiple subjects to learn
- **Interactive Questions**: Three question types:
  - Multiple Choice
  - True/False  
  - Short Answer
- **Progress Tracking**: Real-time progress monitoring with adaptive difficulty
- **Personalized Dashboard**: Visualise your strengths and areas to improve

### For Teachers
- **Class Analytics**: Monitor overall class performance
- **Student Progress**: Track individual student progress
- **Subject Performance**: View performance metrics by subject
- **Real-time Dashboard**: Updates instantly with each student attempt

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with role-based access
- **Database**: PostgreSQL with Row Level Security
// We chose Supabase for its real-time support and developer-friendly Postgres layer.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Miloepeng/LifeHack.git
   cd LifeHack/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The environment variables are already configured in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="your-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key"
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
   
   Navigate to [http://localhost:3000]

## Database Schema

The application uses the following main tables:

- **bkt_model_state**: Keeps track of updated parameters, namely Initial Knowledge, Learning Probability, Guess Probability and Slip Probability
- **skills**: Consists of skills that the web application currently offer
- **questions**: List of questions that are tagged to the various skills offered
- **user_profiles**: Keeps track of users and user type (student/teacher roles)
// Each skill/question pair powers the BKT model to personalise question delivery.

## Authentication & Authorization

### User Roles
- **Students**: Can view subjects, answer questions, track progress
- **Teachers**: Can view all student data, analytics, and class performance

### Security Features
- Row Level Security (RLS) policies enforced in Supabase
- Role-based access control
- Secure authentication with Supabase Auth

## Usage

### For Students
1. **Choose Subject**: Select a subject to start learning
2. **Answer Questions**: Complete questions and track your progress
3. **View Progress**: Monitor your accuracy and learning streaks

### For Teachers
1. **Monitor Class**: View class-wide performance metrics
2. **Track Students**: See individual student progress
3. **Analyze Performance**: Review subject-wise analytics

## Question Types

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

## Analytics Features

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

## Deployment

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. We have made this project free to use, improve and share.

## Support

For support and questions:
- Check the documentation above
- Review the database schema
- Ensure environment variables are correctly set
- Verify Supabase configuration
- Ask a question on the GitHub Issues Page

---

Built using Next.js, TypeScript, and Supabase.

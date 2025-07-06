# Expense Tracker

A comprehensive personal finance tracking application built with Next.js, React, TypeScript, MongoDB, and shadcn/ui.

## 🚀 Features

### Stage 1: Basic Transaction Tracking
- ✅ **Add/Edit/Delete transactions** with full CRUD operations
- ✅ **Transaction list view** with responsive design
- ✅ **Monthly expenses bar chart** using Recharts
- ✅ **Form validation** with error handling and success states

### Stage 2: Categories & Dashboard
- ✅ **Predefined categories** with icons (16 categories including Indian-specific ones)
- ✅ **Category-wise pie chart** with beautiful colors
- ✅ **Dashboard with summary cards**: Total Balance, Expenses, Income, Transaction Count
- ✅ **Recent transactions** display with category badges

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB with proper models
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd complete-finance-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Update `.env.local` with your MongoDB connection string:
   \`\`\`
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Skeleton components and loading indicators
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages for actions
- **Hover Effects**: Interactive elements with smooth transitions

## 🔧 API Endpoints

- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/transactions/summary` - Get dashboard summary
- `GET /api/transactions/monthly` - Get monthly expense data
- `GET /api/transactions/categories` - Get category breakdown


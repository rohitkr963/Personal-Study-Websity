# StudyPro Features & Category System

## How the Category System Works

### Feature: Automatic Category Routing
When you add a question in StudyPro, it gets assigned to a **study section (category)** based on what you select in the Add Form. Here's the complete flow:

### Step 1: Add Question with Category
1. Click the **"+ Add"** button in the top bar
2. Fill in your question details:
   - **Question**: The question text (required)
   - **Answer**: Your notes/solution (optional)
   - **Tags**: Comma-separated labels (e.g., "recursion, tree")
   - **Difficulty**: Easy, Medium, or Hard
3. Notice the **Category** field shows which section this question will be added to
4. Click **"Add Question"** to submit

### Step 2: Question Appears in Category Section
- The question is automatically saved to MongoDB with its category
- Switch to any sidebar category (React, DSA, Node.js, etc.) and you'll see questions added to that section
- Questions with **category="react"** appear in "⚛️ React" section
- Questions with **category="dsa"** appear in "DSA – JavaScript" section

### Step 3: Complete & Review Workflow
Once a question is in its category section:
1. **Mark as Done**: Click the ✓ checkbox to mark question as completed
2. **Mark Reviewed**: Click the 🔥 icon to mark it reviewed (increases reviewLevel)
3. **Star It**: Click the ⭐ to favorite important questions
4. **Edit**: Click ✏️ to modify the question
5. **Delete**: Click 🗑️ to remove it

### Available Study Sections (Categories)

#### Default Sections:
- **All Questions** (Folder icon) - Shows all questions across all categories
- **Starred** (⭐ icon) - Questions you've marked as important
- **Today's Revision** (🔥 icon) - Questions due for review today
- **Completed** (✅ icon) - Questions you've marked as done
- **Trash** (🗑️ icon) - Deleted questions (view-only)

#### Study Sections (Customizable):
- **DSA – JavaScript** (💻 Binary) - Data structures & algorithms
- **⚛️ React** (Atom) - React framework questions
- **Node.js** (🌲 Tree) - Node.js backend topics
- **Express** (⚙️ Server) - Express.js topics
- **MongoDB** (🗄️ Database) - MongoDB & databases
- **+ Add New Section** - Create custom study sections

### Important: Data Storage

**Backend Storage (MongoDB):**
```javascript
{
  "_id": "ObjectId",
  "question": "What is JWT?",
  "answer": "JWT = JSON Web Token...",
  "tags": ["auth", "security"],
  "category": "react",  // ← Category field
  "difficulty": "medium",
  "done": false,
  "starred": false,
  "reviewLevel": 1,
  "lastReviewed": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

**Local Storage (Fallback):**
- Questions are also cached in browser's localStorage
- If backend is unavailable, app uses cached data
- Syncs with backend when connection is restored

### Category Field Values

Valid category values are:
- `"all"` - Default/general questions
- `"dsa"` - Data Structures & Algorithms
- `"react"` - React framework
- `"nodejs"` - Node.js topics
- `"express"` - Express.js topics
- `"mongodb"` - MongoDB & database topics
- Custom categories created via "+ Add New Section" button

### Frontend-Backend Integration

1. **AddForm Component**
   - Sends category in payload to backend
   - Form remembers which category you're in
   - Shows current category in form footer

2. **Home Component**
   - Tracks `activeCategory` state
   - Filters questions by category using sidebar selection
   - Updates TopBar title to show current category
   - Computes stats for filtered questions

3. **Sidebar Component**
   - Shows all available categories
   - Highlights active category with indigo color
   - Allows adding custom study sections
   - Mobile-responsive with slide-in menu

4. **TopBar Component**
   - Shows category title (e.g., "⚛️ React")
   - Displays stats: Total/Completed/Pending
   - Search bar filters questions within category
   - Add button opens Add Form modal

### API Endpoints

All endpoints expect and return questions with category field:

```
GET /api/questions
- Returns all questions with category field

POST /api/questions
- Body must include: question, answer, tags, difficulty, category
- Returns: created question with _id converted to id

PUT /api/questions/:id
- Can update category field along with other fields
- Returns: updated question

PATCH /api/questions/:id/toggle
- Toggles question.done status

PATCH /api/questions/:id/review
- Increments reviewLevel and updates lastReviewed

PATCH /api/questions/:id/star
- Toggles question.starred status
```

### Tips for Best Results

1. **Organize by Topic**: Use different categories for each subject
2. **Consistent Naming**: Use the same category for related questions
3. **Use Tags Too**: Tags provide secondary organization within categories
4. **Review Regularly**: Use the "Today's Revision" section to practice
5. **Create Custom Sections**: Add sections like "Interview Prep", "Job Search", etc.

### Example Workflow

```
1. Learning React?
   → Click "⚛️ React" section
   → Click "+ Add" button
   → Write question about hooks/state
   → Category auto-selects "react"
   → Question appears under React section

2. Want to review?
   → Click "🔥 Today's Revision"
   → Questions due for review appear
   → Click ✓ when done
   → Completion tracked and streak bumped

3. Need to study DSA?
   → Click "DSA – JavaScript"
   → All algorithm questions appear
   → Filter by tags (binary search, dp, etc)
   → Search for specific topic
```

---

**Last Updated**: November 15, 2025
**Version**: 1.0 - Category System Implementation

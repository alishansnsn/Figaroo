const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Figaroo Backend Server is running!'
  });
});

// Test AI endpoint
app.post('/api/ai/generate-component', (req, res) => {
  const { prompt } = req.body;
  
  res.json({
    success: true,
    data: {
      component: {
        html: `<div class="p-4 bg-white rounded-lg shadow-md">
          <h3 class="text-lg font-semibold">Generated Component</h3>
          <p class="text-gray-600">${prompt}</p>
        </div>`,
        css: '',
        raw: 'Test component generated'
      },
      model: 'test-model',
      prompt,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
}); 
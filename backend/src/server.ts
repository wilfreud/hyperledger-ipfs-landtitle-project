
import app from './app.js';

const PORT = process.env.PORT || 6060;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});

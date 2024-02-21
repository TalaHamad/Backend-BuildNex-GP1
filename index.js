import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'; 

const app = express();
dotenv.config(); 

app.use(cors());
app.use(cookieParser());
app.use(express.json());

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import serviceProviderRouter from './routes/serviceProviderRoutes.js'; 
import homeOwnerRouter from './routes/homeOwnerRoutes.js';  

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/serviceprovider', serviceProviderRouter); 
app.use('/homeowner', homeOwnerRouter); 


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {

  console.log(`The Server is running on port ${PORT}`);
});

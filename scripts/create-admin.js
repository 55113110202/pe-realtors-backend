// Script to create admin user in Appwrite
// Run this once: node scripts/create-admin.js

const { Client, Users, ID } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('perealtors')
  .setKey('YOUR_API_KEY_HERE'); // Replace with your API key from Appwrite Console

const users = new Users(client);

async function createAdmin() {
  try {
    const user = await users.create(
      'mohands', // userId
      'perealtorsit@gmail.com', // email
      undefined, // phone (optional)
      'Hical@1767', // password
      'super admin' // name
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('User ID:', user.$id);
    console.log('Email:', user.email);
    console.log('Name:', user.name);
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    if (error.code === 409) {
      console.log('User already exists. Try logging in with the credentials.');
    }
  }
}

createAdmin();

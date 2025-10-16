# PE Realtors Backoffice - Quick Start Guide

![PE Realtors](perealtors-ui/public/logo/logo.png)

## 🚀 Get Started in 3 Steps

### 1. Start the Server
```bash
cd perealtors-ui
npm run dev
```

### 2. Open Browser
Navigate to: `http://localhost:3000`

### 3. Login
- **Email**: `perealtorsit@gmail.com`
- **Password**: `Hical@1767`

---

## 📱 What You'll See

### After Login - Dashboard (`/`)
- **4 Statistics Cards**
  - Total Properties
  - Approved Properties  
  - Pending Approvals
  - Listed Properties

- **Recent Properties Table**
  - Latest 5 property submissions
  - Quick overview of status

### Properties Page (`/properties`)
- **Full Property List**
  - All properties in database
  - Search and filter capabilities
  - Detailed information table

---

## 🔍 Key Features

### Search & Filter
- **Search**: Type Customer ID, Property Type, or Listing Type
- **Status Filter**: All / Approved / Pending / Rejected
- **Listing Filter**: All / Yes / No

### Navigation
- **Dashboard**: Click "Dashboard" in sidebar
- **Properties**: Click "Properties" in sidebar
- **Logout**: Click user avatar → "Sign out"

### Dark Mode
- Toggle using the moon/sun icon in header

---

## 📊 Understanding the Data

### Property Status
- 🟢 **Approved** - Property is approved for listing
- 🟡 **Pending** - Awaiting approval
- 🔴 **Rejected** - Property was rejected

### Listing Status
- 🔵 **Yes** - Property is visible to public
- ⚪ **No** - Property is hidden from public

---

## 🔐 Security

- All routes except `/signin` are protected
- Session persists across page reloads
- Automatic redirect to login when not authenticated
- Secure logout clears session

---

## 💡 Tips

1. **Refresh Data**: Reload the page to get latest properties
2. **Search**: Search works across multiple fields simultaneously
3. **Filters**: Combine search with filters for precise results
4. **Mobile**: Fully responsive - works on phones and tablets

---

## 🆘 Troubleshooting

### Can't Login?
- Check email and password are correct
- Ensure internet connection is active
- Verify Appwrite service is running

### No Properties Showing?
- Check if database has properties
- Try clearing filters
- Refresh the page

### Page Not Loading?
- Ensure dev server is running (`npm run dev`)
- Check console for errors
- Verify port 3000 is not in use

---

## 📞 Need Help?

Refer to:
- `README.md` - Full documentation
- `PE-REALTORS-DOCUMENTATION.md` - Complete project details
- `IMPLEMENTATION-SUMMARY.md` - Technical implementation details

---

**Happy Managing! 🏠**

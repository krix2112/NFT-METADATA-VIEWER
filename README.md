# NFT Metadata Viewer Frontend

A modern web application that interacts with your Aptos smart contract to create and view NFT metadata.

## Features

- 🔗 **Wallet Integration**: Connect with Aptos wallet (Petra, Martian, etc.)
- 🎨 **Create NFT Metadata**: Store NFT name and URI on the blockchain
- 👀 **View NFT Metadata**: Fetch and display metadata for any account
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Feedback**: Loading states, success/error messages

## Files Created

- `index.html` - Main HTML structure
- `app.js` - JavaScript application logic with Aptos SDK integration
- `styles.css` - Modern CSS styling with responsive design

## How to Use

1. **Open the Application**: Open `index.html` in your web browser
2. **Connect Wallet**: Click "Connect Wallet" and approve the connection
3. **Create NFT Metadata**: 
   - Fill in the NFT name and metadata URI
   - Click "Create NFT Metadata" to submit the transaction
4. **View NFT Metadata**:
   - Enter an account address (or click "Use My Address")
   - Click "Fetch Metadata" to retrieve the stored metadata

## Smart Contract Integration

The frontend interacts with your smart contract at address:
```
0x63b355d6f1a9be2d96799b04e1081e67f5a9b3ed8b9e9c5691f07392bba51f60
```

### Functions Used:
- `create_nft_metadata(name: String, uri: String)` - Creates new NFT metadata
- `get_nft_metadata(account: address)` - Retrieves NFT metadata for an account

## Configuration

### Network Settings
The application is currently configured for **testnet**. To change to mainnet:

1. Open `app.js`
2. Find the line: `this.network = "testnet";`
3. Change it to: `this.network = "mainnet";`

### Module Address
If you deploy your contract to a different address, update the `moduleAddress` in `app.js`:

```javascript
this.moduleAddress = "YOUR_NEW_CONTRACT_ADDRESS";
```

## Requirements

- Modern web browser with JavaScript enabled
- Aptos wallet extension (Petra, Martian, etc.)
- Internet connection for Aptos SDK

## Error Handling

The application includes comprehensive error handling for:
- Wallet connection issues
- Transaction failures
- Invalid account addresses
- Missing NFT metadata
- Network errors

## Styling

The application features:
- Modern gradient background
- Card-based layout
- Smooth animations and transitions
- Responsive design for all screen sizes
- Professional color scheme

## Security Notes

- Always verify transactions before signing
- Never share your private keys
- Use testnet for development and testing
- Switch to mainnet only for production use

## Troubleshooting

### Common Issues:

1. **Wallet not connecting**: Ensure you have an Aptos wallet installed
2. **Transaction fails**: Check if you have sufficient APT for gas fees
3. **Metadata not found**: Verify the account address is correct
4. **Network errors**: Check your internet connection

### Browser Console:
Open browser developer tools (F12) to see detailed error messages and debug information.


<img width="3837" height="1768" alt="image" src="https://github.com/user-attachments/assets/bd417d3e-0d11-431a-a861-95b5712ac36c" />


<img width="3839" height="1746" alt="image" src="https://github.com/user-attachments/assets/a7dca893-929c-4bea-87cf-20090baed145" />





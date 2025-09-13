# NFT Metadata Viewer - React Frontend

A modern React frontend application that interacts with your Aptos smart contract to create and view NFT metadata.

## Features

- 🔗 **Wallet Integration**: Connect with Aptos wallet (Petra, Martian, etc.)
- 🎨 **Create NFT Metadata**: Store NFT name and URI on the blockchain
- 👀 **View NFT Metadata**: Fetch and display metadata for any account
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Feedback**: Loading states, success/error messages
- 🎨 **Modern UI**: Beautiful gradient design with glass morphism effects

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Aptos TypeScript SDK** for blockchain interactions
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Aptos wallet extension (Petra, Martian, etc.)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection in your Aptos wallet
2. **Create NFT Metadata**: 
   - Fill in the NFT name and metadata URI
   - Click "Create NFT Metadata" to submit the transaction
3. **View NFT Metadata**:
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

1. Open `src/utils/aptos.ts`
2. Find the line: `network: Network.TESTNET`
3. Change it to: `network: Network.MAINNET`

### Module Address
If you deploy your contract to a different address, update the `MODULE_ADDRESS` in `src/utils/aptos.ts`:

```typescript
export const MODULE_ADDRESS = "YOUR_NEW_CONTRACT_ADDRESS";
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   │   └── useWallet.ts     # Wallet connection hook
│   ├── utils/               # Utility functions
│   │   └── aptos.ts         # Aptos SDK integration
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js         # PostCSS configuration
```

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
- Glass morphism effects
- Card-based layout
- Smooth animations and transitions
- Responsive design for all screen sizes
- Professional color scheme
- Tailwind CSS for utility-first styling

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
5. **Build errors**: Make sure all dependencies are installed

### Browser Console:
Open browser developer tools (F12) to see detailed error messages and debug information.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. Create new components in `src/components/`
2. Add custom hooks in `src/hooks/`
3. Extend Aptos utilities in `src/utils/aptos.ts`
4. Update styles using Tailwind CSS classes

## License

MIT License - see the main project README for details.

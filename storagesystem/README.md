# Storage System

A desktop application for managing storage, clients, products, and shipping records. Built with Tauri, React, Next.js, and SQLite.

## Download and Installation

### From GitHub Releases

1. Go to the [Releases](https://github.com/Ahmad-Alshomaree/Storage-system/releases) page
2. Download the appropriate installer for your operating system:
   - **Windows**: Download `storagesystem_0.1.0_x64-setup.exe` (.exe installer)
   - **Linux**: Download `storagesystem_0.1.0_amd64.AppImage` (recommended) or `.deb`/`.rpm` files
   - **macOS**: Download the `.dmg` file (when available)

### Linux Installation

#### Using AppImage (Recommended - No installation required)
```bash
chmod +x storagesystem_0.1.0_amd64.AppImage
./storagesystem_0.1.0_amd64.AppImage
```

#### Using DEB Package (Ubuntu/Debian)
```bash
sudo dpkg -i storagesystem_0.1.0_amd64.deb
# If you get dependency errors, run:
sudo apt-get install -f
```

#### Using RPM Package (Fedora/RHEL)
```bash
sudo rpm -i storagesystem-0.1.0-1.x86_64.rpm
```

### Windows Installation

#### Using EXE Installer (Recommended)
1. Download `storagesystem_0.1.0_x64-setup.exe` from the [Releases](https://github.com/Ahmad-Alshomaree/Storage-system/releases) page
2. Double-click the downloaded `.exe` file
3. Follow the installation wizard
4. Launch the application from the Start menu or desktop shortcut

#### Portable Version (Alternative)
If you prefer a portable version without installation:
1. Download the `.zip` file from the releases (if available)
2. Extract the zip file to any folder
3. Run `storagesystem.exe` directly

## Features

- **Client Management**: Add, edit, and manage client information
- **Product Management**: Track products, pricing, inventory, and shipping details
- **Shipping Management**: Handle shipping records and logistics
- **Debit Tracking**: Monitor financial transactions and debits
- **Data Import/Export**: Support for Excel file uploads and data management
- **Multi-language Support**: Built-in internationalization

## Development

### Prerequisites

- Node.js (LTS version)
- pnpm
- Rust

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Ahmad-Alshomaree/Storage-system.git
cd Storage-system
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
```bash
pnpm db:migrate
```

4. Run in development mode:
```bash
pnpm tauri dev
```

5. Build for production:
```bash
pnpm tauri build
```

## Technologies Used

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Tauri (Rust), SQLite, Drizzle ORM
- **Desktop Framework**: Tauri
- **UI Components**: Radix UI, Lucide Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.

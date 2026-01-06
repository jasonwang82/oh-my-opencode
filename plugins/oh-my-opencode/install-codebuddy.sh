#!/usr/bin/env bash
set -e

# Install oh-my-opencode plugin to CodeBuddy
# Usage: ./install-codebuddy.sh

PLUGIN_NAME="oh-my-opencode"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CODEBUDDY_PLUGINS_DIR="${HOME}/.codebuddy-plugin"
TARGET_DIR="${CODEBUDDY_PLUGINS_DIR}/${PLUGIN_NAME}"

echo "🚀 Installing oh-my-opencode plugin to CodeBuddy..."
echo ""

# Create CodeBuddy plugins directory if it doesn't exist
if [ ! -d "${CODEBUDDY_PLUGINS_DIR}" ]; then
    echo "📁 Creating CodeBuddy plugins directory: ${CODEBUDDY_PLUGINS_DIR}"
    mkdir -p "${CODEBUDDY_PLUGINS_DIR}"
fi

# Remove existing installation if present
if [ -d "${TARGET_DIR}" ]; then
    echo "🗑️  Removing existing installation..."
    rm -rf "${TARGET_DIR}"
fi

# Copy plugin files
echo "📦 Copying plugin files..."
cp -r "${SCRIPT_DIR}" "${TARGET_DIR}"

# Remove installation scripts from target (not needed in installed version)
rm -f "${TARGET_DIR}/install-claude.sh"
rm -f "${TARGET_DIR}/install-codebuddy.sh"

echo ""
echo "✅ Installation complete!"
echo ""
echo "📍 Plugin installed to: ${TARGET_DIR}"
echo ""
echo "📋 Next steps:"
echo "   1. Restart CodeBuddy application"
echo "   2. Use agents: @oh-my-opencode:sisyphus, @oh-my-opencode:oracle, etc."
echo ""
echo "🔧 Configuration:"
echo "   - Edit ${TARGET_DIR}/hooks/hooks.json to enable/disable hooks"
echo "   - Edit ${TARGET_DIR}/.mcp.json to configure MCP servers"
echo ""
echo "📚 Documentation:"
echo "   - README: ${TARGET_DIR}/README.md"
echo "   - Installation guide: ${TARGET_DIR}/INSTALL.md"
echo "   - Tools reference: ${TARGET_DIR}/TOOLS.md"
echo "   - Hooks reference: ${TARGET_DIR}/HOOKS.md"
echo ""
echo "🎉 Happy coding with oh-my-opencode on CodeBuddy!"

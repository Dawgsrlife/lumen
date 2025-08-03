# Unity WebGL Setup Guide for Lumen

## Unity Build Requirements

Your Unity WebGL builds must follow this exact file structure for react-unity-webgl to work:

```
public/
├── unity-builds/
│   └── [game-name]/
│       ├── Build.loader.js      # Unity loader script
│       ├── Build.data           # Game data
│       ├── Build.framework.js   # Unity framework
│       ├── Build.wasm           # WebAssembly binary
│       └── StreamingAssets/     # (Optional) Additional assets
```

## Unity Build Settings

When building your Unity project for WebGL:

1. **File > Build Settings**
2. **Platform: WebGL**
3. **Template: Default** (or Custom template)
4. **Compression Format: Gzip** (recommended)
5. **Code Optimization: Size** (for faster loading)

### Important Unity WebGL Build Settings:

- **Publishing Settings > Decompression Fallback**: ✅ Enabled
- **Publishing Settings > Data Caching**: ✅ Enabled  
- **Publishing Settings > Debug Symbols**: ❌ Disabled (for production)
- **Player Settings > WebGL Memory Size**: 256MB-512MB (adjust based on game)

## React Integration

Use the UnityGame component like this:

```tsx
<UnityGame
  gameId="color-bloom"
  gameTitle="Color Bloom"
  description="Nurture your emotions through growing flowers"
  buildUrl="/unity-builds/color-bloom"  // Path relative to public/
  sceneIndex={0}
  emotionData={{
    emotion: "sadness",
    intensity: 7
  }}
  onGameComplete={(data) => console.log('Game completed:', data)}
  onRewardEarned={(reward) => console.log('Reward earned:', reward)}
/>
```

## Common Issues & Solutions

### 1. **Loading Progress Stuck at 0%**
- **Cause**: Unity files not found (404 errors)
- **Solution**: Check file paths and ensure builds are in `public/unity-builds/`

### 2. **CORS Errors**
- **Cause**: Trying to load from incorrect domain/protocol
- **Solution**: Serve files from same origin, use relative paths

### 3. **Memory Errors**
- **Cause**: Unity WebGL memory limit exceeded
- **Solution**: Increase WebGL Memory Size in Unity Player Settings

### 4. **Loading Fails Silently**
- **Cause**: Missing or corrupted Unity build files
- **Solution**: Rebuild Unity project, check file integrity

## Debugging Steps

1. **Check Browser Console** for network errors (404, CORS, etc.)
2. **Verify File Structure** - files must be in `public/` folder
3. **Check Network Tab** - see which files are failing to load
4. **Test Build Locally** - ensure Unity build works standalone

## Unity Script Communication

To receive messages from React in Unity, create a GameObject with this script:

```csharp
using UnityEngine;

public class GameManager : MonoBehaviour 
{
    // Called from React to receive emotion data
    public void ReceiveEmotionData(string jsonData)
    {
        Debug.Log("Received emotion data: " + jsonData);
        // Parse and use emotion data in game
    }
    
    // Called from React to load specific scene
    public void LoadScene(string sceneIndex)
    {
        int index = int.Parse(sceneIndex);
        Debug.Log("Loading scene: " + index);
        // Load specific mini-game scene
    }
    
    // Called from React to start game
    public void StartGame(string gameData)
    {
        Debug.Log("Starting game with data: " + gameData);
        // Initialize game with provided data
    }
    
    // Called from React to end game
    public void EndGame()
    {
        Debug.Log("Ending game");
        // Clean up and return to menu
    }
}
```

## Testing Checklist

- [ ] Unity build files exist in correct location
- [ ] All 4 required files present (loader.js, data, framework.js, wasm)
- [ ] Files are accessible via HTTP (check Network tab)
- [ ] Unity build works in standalone browser
- [ ] React component shows loading progress
- [ ] Error messages appear if files missing
- [ ] Console shows debug information

## File Size Recommendations

- **Total Build Size**: < 50MB (for good loading performance)
- **Compression**: Always use Gzip compression
- **Texture Quality**: Optimize for web (lower resolution)
- **Audio Quality**: Compress audio files
- **Code Stripping**: Enable IL2CPP code stripping

This setup ensures your Unity games integrate smoothly with the Lumen React application.
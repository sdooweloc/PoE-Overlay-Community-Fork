This is a special repack branch used as a work-around for the lacking support of signing the internals of the NSIS packages produced from a normal Electron build.  
  
How to use this branch?  
1. Build a normal release using AppVeyor
2. Approve the sign-request at SignPath
3. Download the signed artifacts
4. Rename the `publish.zip` to `repack.zip`
5. Put the `repack.zip` in the project folder (replace the existing one)
6. Push to this branch using the appropriate commit message
7. Build it using AppVeyor (it'll repack instead of rebuild)
8. Approve the sign-request at SignPath
9. Download the signed artifacts
10. Put all files in the `release` folder
11. Run the `prep-release` command (to regenerate the `latest.yml` since the exe changed after signing)
12. Publish the final release exes and `latest.yml` at GitHub (Ignore the `.blockmap` since we can't manually regenerate this after signing)

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )
  
  FilePond.setOptions({ // search
    stylePanelAspectRatio: 30 / 100, // size in page
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
  })
  
  FilePond.parse(document.body); // converting all file to filepond

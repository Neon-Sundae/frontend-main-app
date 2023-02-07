const uploadToS3 = async (signedUrl: string, file: File) => {
  try {
    await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: file,
    });
  } catch (e) {
    console.log(e);
    throw new Error('Failed to upload image');
  }
};

export default uploadToS3;

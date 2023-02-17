export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  if (!file) return callback(new Error('File is empty'), false) // false: no acepto el archivo

  const fileExtension = file.mimetype.split('/')[1]
  const validExtensions = ['jpg', 'png', 'jpeg', 'gif']

  if (validExtensions.includes(fileExtension)) return callback(null, true)

  callback(null, false)
}

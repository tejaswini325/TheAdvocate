const Document = require('../models/Document');
const Case = require('../models/Case');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ================== MULTER CONFIG ==================
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('file');

// ================== UPLOAD DOCUMENT ==================
exports.uploadDocument = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { caseId, documentName, documentType } = req.body;

      if (!caseId) {
        return res.status(400).json({ success: false, message: 'Case ID is required' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'File is required' });
      }

      const caseExists = await Case.findById(caseId);
      if (!caseExists) {
        await fs.promises.unlink(req.file.path);
        return res.status(404).json({ success: false, message: 'Case not found' });
      }

      const newDocument = await Document.create({
        caseId,
        documentName: documentName || req.file.originalname,
        documentType: documentType || 'Other',
        status: 'Pending',
        fileUrl: `uploads/${req.file.filename}`,
        fileSize: req.file.size,
        uploadedAt: new Date()
      });

      res.status(201).json({
        success: true,
        data: newDocument
      });

    } catch (error) {
      if (req.file) {
        await fs.promises.unlink(req.file.path);
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
};

// ================== GET ALL DOCUMENTS ==================
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('caseId', 'caseTitle caseNumber')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      results: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================== GET SINGLE DOCUMENT ==================
exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('caseId', 'caseTitle caseNumber');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================== DOWNLOAD DOCUMENT ==================
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Get the filename from the fileUrl
    const filename = document.fileUrl.split('/').pop();
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    console.log('Download - Looking for file at:', filePath);
    console.log('Download - File exists:', fs.existsSync(filePath));
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.download(filePath, document.documentName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================== VIEW DOCUMENT ==================
exports.viewDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Get the filename from the fileUrl
    const filename = document.fileUrl.split('/').pop();
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    console.log('View - Looking for file at:', filePath);
    console.log('View - File exists:', fs.existsSync(filePath));
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ================== UPDATE DOCUMENT ==================
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { caseId, documentName, documentType, status } = req.body;
    
    console.log('Updating document:', id, 'with data:', { caseId, documentName, documentType, status });
    
    const document = await Document.findByIdAndUpdate(
      id,
      {
        caseId,
        documentName,
        documentType,
        status
      },
      { new: true, runValidators: true }
    );

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// ================== DELETE DOCUMENT ==================
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Delete file from server
    const filename = document.fileUrl.split('/').pop();
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log('File deleted:', filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const Router = require('express')
const router = new Router()
const algController = require('../controllers/algController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', checkRole('ADMIN'), algController.getAll)
router.get('/:userId', checkRole('USER'), authMiddleware, algController.getAllUser)
router.post('/getAll', algController.getAllTable)
router.post('/getFields', algController.getFields)
router.post('/', algController.save)
router.post('/update', algController.update)
router.post('/execute', algController.executeAlg)
router.post('/generate', algController.generate)
router.post('/view', algController.view)
router.delete('/', algController.delete)

module.exports = router

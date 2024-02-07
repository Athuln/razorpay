import { shared } from '@appblocks/node-sdk'

const handler = async (event) => {
  const { req, res } = event

  const { prisma, healthCheck, sendResponse } = await shared.getShared()

  try {
    // health check
    if (healthCheck(req, res)) return

    const planId = req.query.id

    const plan = await prisma.plans.findFirst({where: {id: planId}})

    // Add your code here
    sendResponse(res, 200, { success: true, msg: `Plan retrieved successfully`, data: plan })
  } catch (error) {
    let errMsg = `Something went wrong`
    if (error.statusCode === 404) errMsg = 'No data found'
    sendResponse(res, error.statusCode || 400, { success: false, msg: errMsg, error })
  }
}

export default handler

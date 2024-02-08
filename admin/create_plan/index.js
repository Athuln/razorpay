import { shared } from '@appblocks/node-sdk'
import { nanoid } from 'nanoid'

const handler = async (event) => {
  const { req, res } = event

  const { prisma, razorpay, healthCheck, getBody, sendResponse } = await shared.getShared()

  try {
    // health check
    if (healthCheck(req, res)) return

    const reqBody = await getBody(req)

    const savedData = await prisma.plans.create({ data: { id: nanoid(), ...reqBody } })
    console.log({ savedData })
    
    // Add your code here
    sendResponse(res, 200, { success: true, msg: `Plan created successfully`, data: savedData })
    
    await razorpay.createRazorpayPlan(req, savedData)
  } catch (error) {
    sendResponse(res, 400, { success: false, msg: `Something went wrong`, error })
  }
}

export default handler
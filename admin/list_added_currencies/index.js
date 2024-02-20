import { shared } from '@appblocks/node-sdk'

const handler = async (event) => {
  const { req, res } = event

  const { prisma, healthCheck, sendResponse, getBody, validateBody } = await shared.getShared()

  try {
    // health check
    if (healthCheck(req, res)) return

    const reqBody = await getBody(req)

    await validateBody(reqBody, 'availableCurrencySchema')

    // eslint-disable-next-line prefer-const
    let { searchKeyword = '', count = 10, skip = 0 } = reqBody
    const query = {
      where: {},
    }

    if (searchKeyword.length > 0) {
      searchKeyword = searchKeyword.toLowerCase()
      query.where = {
        ...query.where,
        countryName: {
          contains: `${searchKeyword}`,
        },
      }
    }

    if (count) query.take = Number(count)
    if (skip) query.skip = Number(skip)

    const currencies = await prisma.currency.findMany(query)

    // Add your code here
    sendResponse(res, 200, { success: true, msg: `Added Currencies retrieved successfully`, data: currencies })
  } catch (error) {
    console.log('error is', error)
    sendResponse(res, 400, { success: false, msg: `Something went wrong`, error })
  }
}

export default handler

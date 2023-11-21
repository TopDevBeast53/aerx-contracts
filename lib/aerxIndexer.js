import { startStream } from 'near-lake-framework';

const lakeConfig = {
    s3BucketName: "near-lake-data-testnet",
    s3RegionName: "eu-central-1",
    startBlockHeight: 98406515,
};

const handleGetBlockDetails = async (streamerMessage) => {
    console.log(`
    Block #${streamerMessage.block.header.height}
    Shards: ${streamerMessage.shards.length}
`);
}

const getBlockDetails = async () => {
    await startStream(lakeConfig, handleGetBlockDetails);
}

const handleNFTMintEvent = async(streamerMessage) => {
  const createdOn = new Date(streamerMessage.block.header.timestamp / 1000000)
  const relevantOutcomes = streamerMessage
    .shards
    .flatMap(shard => shard.receiptExecutionOutcomes)
    .map(outcome => ({
      receipt: {
        id: outcome.receipt.receiptId,
        receiverId: outcome.receipt.receiverId,
      },
      events: outcome.executionOutcome.outcome.logs.map(
        (log) => {
          const [_, probablyEvent] = log.match(/^EVENT_JSON:(.*)$/) ?? []
          try {
            return JSON.parse(probablyEvent)
          } catch (e) {
            return
          }
        }
      )
      .filter(event => event !== undefined)
    }))
    .filter(relevantOutcome =>
      relevantOutcome.events.some(
        event => event.standard === "nep171" && event.event === "nft_mint"
      )
    )
        let output = []
        for (let relevantOutcome of relevantOutcomes) {
        let nfts = []
        if (relevantOutcome.receipt.receiverId == "aerxtestnew.mohzcrea8me.testnet") {
        nfts = relevantOutcome.events.flatMap(event => {
            return (event.data)
            .map(eventData => ({
                owner: eventData.owner_id,
                tokenId: eventData.token_ids[0]
            })
            )
        })
        output.push({
            receiptId: relevantOutcome.receipt.id,
            marketplace: "aerxtestnew.mohzcrea8me.testnet",
            createdOn,
            nfts,
            })
            if (output.length) {
                console.log(`Minted Nfts on Aerx Contract`)
                console.dir(output, { depth: 5 })
            }
        //alert owner(if hasn't been alerted before)
        }
        }
        
}

const getMintDetails = async () => {
  await startStream(lakeConfig, handleNFTMintEvent);
}
getMintDetails()

// export{getBlockDetails, getMintOrTokenTransferDetails}
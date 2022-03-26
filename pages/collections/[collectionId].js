import { useEffect, useMemo, useState } from 'react'
import { Link } from 'next/link'
import { useRouter } from 'next/router'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'

import Header from '../../components/Header.js'
import NFTCard from '../../components/NFTCard.js'

import { client } from '../../lib/sanityClient.js'

import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'


const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem] mr-5`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}


const Collection = () => {
  const router = useRouter()
  const { provider } = useWeb3()

  const { collectionId } = router.query

  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [listings, setListings] = useState([])

  
  const nftModule = useMemo(() => {
    if (!provider) return

    const url = 'https://rinkeby.infura.io/v3/BGCbYsNijEj8yuoqWm6Srd8ybug3zlzi'

    const sdk = new ThirdwebSDK(provider.getSigner(), url)
    return sdk.getNFTModule(collectionId)
  }, [provider])

  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getAll()
      setNfts(nfts)
    })()
  }, [nftModule])


  const marketPlaceModule = useMemo(() => {
    if (!provider) return

    const market = '0x93A771F7ce845C33381f677489cF21a5964EDD0b'
    const url = 'https://rinkeby.infura.io/v3/BGCbYsNijEj8yuoqWm6Srd8ybug3zlzi'

    const sdk = new ThirdwebSDK(provider.getSigner(), url)
    return sdk.getMarketplaceModule(market)
  }, [provider])

  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      setListings(await marketPlaceModule.getAllListings())
    })()
  }, [marketPlaceModule])


  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${collectionId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`

    const collectionData = await sanityClient.fetch(query)

    console.log(collectionData)

    await setCollection(collectionData[0])
  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : 'https://via.placeholder.com/200'
          }
          alt="Banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection.imageUrl
                : 'https://via.placeholder.com/200'
            }
            alt="Profile image"
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{' '}
            <span className="text-[#2081e2]">
              Ville Pakarinen
              {/* {collection?.creator} */}
            </span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                1
                {/* {collection?.allOwners ? collection.allOwners.length : ''} */}
              </div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  className={style.ethLogo}
                  src="https://avatars.githubusercontent.com/u/38262884?v=4"
                  alt="ETH logo"
                />
                8{/* {collection?.floorPrice} */}
              </div>
              <div className={style.statName}>floor price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  className={style.ethLogo}
                  src="https://avatars.githubusercontent.com/u/38262884?v=4"
                  alt="ETH logo"
                />
                800
                {/* {collection?.volumeTraded}.5K */}
              </div>
              <div className={style.statName}>volume traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>
            The Bored Ape Yacht Club is a collection of unique Bored Ape NFTs
            {/* {collection?.description} */}
          </div>
        </div>
        <div className="flex flex-wrap">
          {nfts.map((nftItem, id) => (
            <NFTCard
              key={id}
              nftItem={nftItem}
              title={collection?.title}
              listings={listings}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection

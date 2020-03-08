import Header from '../../components/header'
import ExtLink from '../../components/ext-link'

export default () => (
  <>
    <Header titlePre="Life" category="Life" />
    <div className="container mx-auto max-w-screen-lg px-3">
      <div className="flex flex-col justify-center">
        <img
          src="/avatar.png"
          alt="avatar with letters JJ"
          className="w-32 mx-auto m-2"
        />
        <div className="text-center m-2">준비 중...</div>
      </div>
    </div>
  </>
)

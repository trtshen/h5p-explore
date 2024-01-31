import Image from 'next/image'
import H5Ppage from './h5p/page';
import DefaultFooter from '../components/default-footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">

      <div className="relative flex place-items-center">
        <H5Ppage />
      </div>

      <DefaultFooter />
    </main>
  )
}

import "./LoadingPostSkeleton.css";

const LoadingPostSkeleton = () => {
  return (
    <div className=" w-full flex flex-col gap-6 border-8 rounded-lg border-secondary relative animate-pulse">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-4/5 md:w-1/2 h-8 bg-gray-300 rounded-lg mt-8 m-auto loading-animation"></div>
        <div className="flex">
          <div className="w-9 h-9 bg-gray-300 rounded-full mt-8 mr-2 loading-animation"></div>
          <div className="flex flex-col justify-end mr-6 mt-8 ">
            <div className="w-32 h-4 bg-gray-300 rounded loading-animation"></div>
            <div className="w-20 h-3 bg-gray-200 rounded mt-1 loading-animation"></div>
          </div>
        </div>
      </div>
      <div className="px-4 w-full max-w-[100%] sm:max-w-[400px] md:max-w-[600px] h-auto object-contain m-auto">
        <div className="flex justify-center items-center w-full h-72 bg-gray-300 rounded-lg loading-animation ">
          <p className="loading-text-animation text-2xl font-bold">
            Loading...
          </p>
        </div>
      </div>
      <div className="px-8 pb-4 lg:px-16">
        <div className="w-full h-16 bg-gray-300 rounded-lg mb-4 loading-animation"></div>
        <div className="w-24 h-6 bg-gray-300 rounded-full mb-4 loading-animation"></div>
        <div className="my-6 flex gap-6">
          <div className="flex gap-1 items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full loading-animation"></div>
            <div className="w-12 h-3 bg-gray-300 rounded loading-animation"></div>
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full loading-animation"></div>
            <div className="w-12 h-3 bg-gray-300 rounded loading-animation"></div>
          </div>
        </div>
        <div className="flex w-full mt-2 gap-2">
          <div className="w-full h-10 bg-gray-300 rounded-l-lg loading-animation"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-r-lg loading-animation"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPostSkeleton;

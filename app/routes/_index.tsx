import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-row w-full h-screen items-center justify-center">
      <div className="max-w-lg space-y-6">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex max-w-md flex-col items-center justify-center space-y-6">
            <div className="flex w-full flex-col items-center space-y-4">
              <img src="/airplane.png" alt={""} className="h-12" />
              <div className="cursor-default select-none space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-gray-1">
                  NeoFlex Tours
                </h1>
                <h3 className="flex flex-col text-center text-sm font-medium text-dark-8">
                  Авторизуйтесь для подбора отпускного тура специально под ваши
                  запросы
                </h3>
              </div>
            </div>
            {/* actions here */}
          </div>
        </div>
      </div>
    </div>
  );
}

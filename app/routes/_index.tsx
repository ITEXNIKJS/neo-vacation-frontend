import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ArrowRight, ArrowUpRight, Plane } from "lucide-react";
import {
  RemixFormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";

import { ComboBoxResponsive } from "~/components/combobox";
import { CITIES, COUNTRIES } from "~/lib/constants";
import { check_auth } from "~/services/authentication";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Button, buttonVariants } from "~/components/ui/button";
import { DatePickerWithRange } from "~/components/date-range-pricker";
import { DateRange } from "react-day-picker";
import { addDays, differenceInCalendarDays } from "date-fns";
import { Input } from "~/components/ui/input";
import axios, { isAxiosError } from "axios";

export interface IOrder {
  "Дата заезда": string;
  "Город вылета": string;
  "Длительность в ночах": number;
  "Регион проживания": string;
  Отель: string;
  Пансион: string;
  "Тип номера": string;
  Цена: number;
  "Доступные места в отеле": string;
  "Цена с убытком": number;
  Категория: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "NeoFlex Tours" },
    { name: "description", content: "Welcome to NeoFlex!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await check_auth(request, { failerRedirect: "/login" });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user_id = await check_auth(request);

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, FormResolver);

  if (errors) {
    return json({ errors, defaultValues });
  }

  try {
    const response = await axios.get<IOrder[]>(
      process.env.API_URL +
        `/api/v1/tour/?country=${data.country}&city=${
          data.city
        }&start_date=${data.dates.from.toLocaleDateString(
          "ru"
        )}&amount_of_days=${differenceInCalendarDays(
          data.dates.to,
          data.dates.from
        )}&price_min=${data.price_min}&price_max=${
          data.price_max
        }&user_id=${user_id}`
    );

    return json({ tours: response.data, errors: null });
  } catch (err) {
    if (isAxiosError(err)) {
      return json({
        tours: null,
        errors: { country: { message: err.response?.data.detail } },
        defaultValues,
      });
    }
  }
};

const schema = zod.object({
  city: zod.string({ required_error: "Выберите город отправления" }),
  country: zod.string({ required_error: "Выберите страны прибытия" }),
  dates: zod
    .object(
      {
        from: zod.coerce.date({ required_error: "Выберите даты отпуска" }),
        to: zod.coerce.date({ required_error: "Выберите даты отпуска" }),
      },
      { required_error: "Выберите даты отпуска" }
    )
    .refine((schema) => {
      return differenceInCalendarDays(schema.to, schema.from) <= 20;
    }, "Максимальный период отпуска 20 дней"),
  price_min: zod.string({ required_error: "Выберите минимальный бюджет" }),
  price_max: zod.string({ required_error: "Выберите максимальный бюджет" }),
});

type FormData = zod.infer<typeof schema>;

export const FormResolver = zodResolver(schema);

export default function Index() {
  const form = useRemixForm<FormData>({
    resolver: FormResolver,
  });

  const navigation = useNavigation();

  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  const data = useActionData<{
    tours: IOrder[] | null;
    errors: unknown[] | null;
  }>();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
      <div className="flex w-full flex-col items-center space-y-4">
        <img src="/airplane.png" alt={""} className="h-12" />
        <div className="cursor-default select-none space-y-2 text-center">
          <h1 className="text-4xl font-semibold text-gray-1">
            Поиск туров для отдыха в отпуск
          </h1>
          <h3 className="flex flex-col text-center text-lg font-medium text-dark-8">
            Заполните форму и получите выгодные предложения по турам
          </h3>
        </div>
      </div>

      <RemixFormProvider {...form}>
        <Form
          className="flex flex-row gap-2 items-center"
          onSubmit={form.handleSubmit}
        >
          <FormField
            control={form.control}
            name="city"
            render={() => (
              <FormItem className="relative">
                <FormControl>
                  <ComboBoxResponsive
                    placeholder={
                      <p className="flex items-center gap-2">
                        <Plane size={18} />
                        <span className="block">Город отправления</span>
                      </p>
                    }
                    command_placeholder="Найти город..."
                    list={CITIES}
                    handleChange={(value: string) => {
                      form.setValue("city", value);
                    }}
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-4 text-nowrap" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={() => (
              <FormItem className="relative">
                <FormControl>
                  <ComboBoxResponsive
                    placeholder={
                      <p className="flex items-center gap-2 items-center justify-center w-full">
                        <Plane size={18} className="rotate-90" />
                        <span className="block">Страна прибытия</span>
                      </p>
                    }
                    command_placeholder="Найти страну..."
                    list={COUNTRIES}
                    handleChange={(value: string) => {
                      form.setValue("country", value);
                    }}
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-4 text-nowrap" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <DatePickerWithRange
                    date={field.value as unknown as DateRange}
                    setDate={(date: DateRange | undefined) => {
                      form.setValue("dates", {
                        from: date?.from
                          ? new Date(date?.from as Date)
                          : new Date(),
                        to: date?.to ? new Date(date?.to as Date) : new Date(),
                      });
                    }}
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-4 text-nowrap" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price_min"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    placeholder="Минимальный бюджет"
                    type="number"
                    className="h-14"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-4 text-nowrap" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price_max"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    placeholder="Максимальный бюджет"
                    type="number"
                    className="h-14"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-4 text-nowrap" />
              </FormItem>
            )}
          />

          <Button className="h-14" isLoading={isLoading} type="submit">
            Подобрать туры
          </Button>
        </Form>
      </RemixFormProvider>

      {data?.tours ? (
        <div className="w-full flex flex-col gap-2 max-w-4xl">
          {data.tours.map((tour) => (
            <div key={tour["Цена"] + tour["Отель"]} className="space-y-2">
              <h1 className="font-semibold text-lg">{tour["Категория"]}</h1>
              <div className="bg-dark-5 rounded-lg p-4 flex flex-row justify-between">
                <div className="flex flex-col justify-between">
                  <div className="flex flex-row gap-12">
                    <div className="flex flex-row gap-2 items-center">
                      <div>{tour["Город вылета"]}</div>
                      <div>
                        <ArrowRight size={16} />
                      </div>
                      <div>{tour["Регион проживания"]}</div>
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                      <div>Даты тура: {tour["Дата заезда"]}</div>
                      <div>
                        <ArrowRight size={16} />
                      </div>
                      <div>
                        {addDays(
                          new Date(
                            new Date(
                              tour["Дата заезда"].split(".").reverse().join("-")
                            )
                          ),
                          tour["Длительность в ночах"]
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div>Цена: {parseInt(tour["Цена"].toString())}₽</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Form action="/action/buy" method="POST" navigate={false}>
                    <input
                      type="hidden"
                      name="order"
                      value={JSON.stringify(tour)}
                    />
                    <Button
                      type="submit"
                      className={buttonVariants({
                        variant: "primary",
                        size: "sm",
                        className: "w-full",
                      })}
                    >
                      Купить
                    </Button>
                  </Form>

                  <Button
                    onClick={() =>
                      (window.location.href = tour["Доступные места в отеле"])
                    }
                    className={buttonVariants({ variant: "dark", size: "sm" })}
                    icon={<ArrowUpRight size={18} />}
                  >
                    Перейти на сайт
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

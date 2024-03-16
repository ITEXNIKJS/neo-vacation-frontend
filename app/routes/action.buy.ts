import type { ActionFunctionArgs } from "@remix-run/node";
import { check_auth } from "~/services/authentication";
import { prisma } from "~/services/db";
import { IOrder } from "./_index";
import { formatISO, parse } from "date-fns";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const user_id = await check_auth(request);

  const order: IOrder = JSON.parse(formData.get("order") as string);

  const parsedDate = parse(order["Дата заезда"], "dd.MM.yyyy", new Date());

  const isoDateTime = formatISO(parsedDate, { representation: "complete" });

  await prisma.order.create({
    data: {
      dateIn: isoDateTime,
      duration: order["Длительность в ночах"],
      available_places: order["Доступные места в отеле"],
      boarding: order["Город вылета"],
      category: order.Категория,
      country: order["Регион проживания"],
      hotel: order.Отель,
      pansion: order.Пансион,
      price: order.Цена,
      price_with_loss: order["Цена с убытком"],
      room_type: order["Тип номера"],
      user: {
        connect: {
          id: user_id
        }
      }
    },
  });

  return null;
};

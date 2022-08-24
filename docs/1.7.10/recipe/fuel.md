description: Топливо для печи

# Топливо для печи

В печи можно использовать в качестве топлива различные предметы, чтобы добавить свой предмет, необходимо воспользоваться
двумя способами.

1. С помощью `IFuelHandler`
2. С помощью `FuelBurnTimeEvent`

## Таблица времени горения

!!! tip "Подсказка"
    Все значения указаны в тиках! 20 тиков = 1 сек.

| Название топлива                     | Время горения |
|--------------------------------------|---------------|
| Палка(Items.stick)                   | 100           |
| Саженец(Blocks.sapling)              | 100           |
| Деревянная плита(Blocks.wooden_slab) | 150           |
| Деревянные инструменты               | 200           |
| Блоки материала WOOD                 | 300           |
| Уголь(Items.coal)                    | 1600          |
| Стержень ифрита(Items.blaze_rod)     | 2400          |
| Угольный блок(Blocks.coal_block)     | 16_000        |
| Ведро лавы(Items.lava_bucket)        | 20_000        |

# IFuelHandler

Интерфейс `IFuelHandler` предназначен для отслеживания обработки входящего стэка и 
возврата времени горения в зависимости от условия.

Создадим класс `FuelHandler`, куда добавим проверку на такие предметы: удочка, кровать и миска, для которых мы зададим
время горения

```java
package ru.mcmodding.tutorial.common.handler;

import cpw.mods.fml.common.IFuelHandler;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;

public class FuelHandler implements IFuelHandler {
    @Override
    public int getBurnTime(ItemStack fuelStack) {
        // Проверяем входящий стэк на null, чтобы не получить исключение NullPointerException
        if (fuelStack == null) {
            return 0;
        }
        final Item fuelItem = fuelStack.getItem();
        // Если предмет топлива - удочка, то время горения будет 350 тиков
        if (fuelItem == Items.fishing_rod) {
            return 350;
        } 
        // Если предмет топлива - кровать, то время горения будет 1100 тиков
        else if (fuelItem == Items.bed) {
            return 1100;
        } 
        // Если предмет топлива - миска, то время горения будет 900 тиков
        else if (fuelItem == Items.bowl) {
            return 900;
        }
        return 0;
    }
}
```

Необходимо зарегистрировать нашу реализацию `IFuelHandler`, для этого необходимо 
вызвать метод `GameRegistry#registerFuelHandler(IFuelHandler)` в `CommonProxy#preInit`.

```java
public class CommonProxy {
    public void preInit(FMLInitializationEvent event) {
        GameRegistry.registerFuelHandler(new FuelHandler());
    }
}
```

Запускаем игру и пробуем сжечь удочку, кровать и миску.

# FuelBurnTimeEvent

!!! danger "Внимание!"
    Данная глава рассчитана на разработчиков, прочитавших раздел "События"!

Аналогично `IFuelHandler` вы можете воспользоваться событием `FuelBurnTimeEvent`. Данный способ отличается от первого
тем, что в случае `IFuelHandler` нельзя заменить Minecraft топливо. Во всех остальных случаях MinecraftForge рекомендует
использовать `IFuelHandler`.

Зададим новое значение для угля, вместо 1600 тиков, уголь будет иметь 2600 тиков времени горения.

```java
public class ForgeEventListener {
    @SubscribeEvent
    public void onFuelBurnTime(FuelBurnTimeEvent event) {
        if (event.fuel == null) return;
        final Item fuelItem = event.fuel.getItem();
        if (fuelItem == Items.coal) {
            event.burnTime = 2600;
        }
    }
}
```

Запускаем игру и проверяем как долго теперь горит уголь. Для сравнения вы можете взять древесный уголь.
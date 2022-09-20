description: Добавление собственных чар.

# Собственные чары

В игре имеется большое кол-во разнообразных чар, которые позволяют улучшить инструменты и броню. В данной статье мы
поговорим о создании собственных чар!

Создадим чары, которые будут накладывать отравление на сущность, если её ударить.

```java title="PoisonBladeEnchantment.java"
package ru.mcmodding.tutorial.common.enchantment;

import net.minecraft.enchantment.Enchantment;
import net.minecraft.enchantment.EnumEnchantmentType;
import net.minecraft.entity.Entity;
import net.minecraft.entity.EntityLivingBase;
import net.minecraft.potion.Potion;
import net.minecraft.potion.PotionEffect;

public class PoisonBladeEnchantment extends Enchantment {
    public PoisonBladeEnchantment() {
        super(70, 3, EnumEnchantmentType.weapon);
        setName("poison_blade");
        addToBookList(this);
    }

    /**
     * Дополнительная обработка при атаке сущности.
     *
     * @param attacker атакующий.
     * @param victim цель атакующего или его жертва.
     * @param level уровень чар
     */
    @Override
    public void func_151368_a(EntityLivingBase attacker, Entity victim, int level) {
        if (victim instanceof EntityLivingBase) {
            ((EntityLivingBase) victim).addPotionEffect(new PotionEffect(Potion.poison.id, 200 * level));
        }
    }

    /**
     * Максимальный уровень чар.
     *
     * @return Возвращает максимальный уровень для зачаривания.
     */
    @Override
    public int getMaxLevel() {
        return 5;
    }
}
```

Конструктор класса `Enchantment` принимает три параметра:

1. `enchantId` - уникальный идентификатор чар.
2. `weight` - "вес" чар, влияет на стоимость зачаривания в наковальне, а также вероятность появления в генерации лута и у жителей в торговле.
3. `type` - применимость чар к предметам.

!!! danger "Обратите внимание!"
    Всего в игре может быть 256 чар(таблицу имеющихся чар и их идентификаторы можно посмотреть в таблице, в конце статьи),
    не забывайте про существование модов и хорошим тоном будет считаться вынос идентификатора чар в конфиг! Вы можете
    расширить самостоятельно массив чар с помощью рефлексии или использовать моды, которые уже это делают.

Применимость чар определяется с помощью перечисления `EnumEnchantmentType`:

| Название    | Описание                  |
|-------------|---------------------------|
| all         | Все предметы              |
| armor       | Броня                     |
| armor_feet  | Ботинки                   |
| armor_legs  | Штаны                     |
| armor_torso | Нагрудник                 |
| armor_head  | Шлем                      |
| weapon      | Оружие                    |
| digger      | Инструмент                |
| fishing_rod | Удочка                    |
| breakable   | Предмет имеющий прочность |
| bow         | Лук                       |

Также вы могли заметить вызов метода `Enchantment#addToBookList(Enchantment)`, данный метод добавляет в список книг с чарами
наши новосозданные чары. Если вы не хотите, чтобы была книга с вашими чарами, то просто удалите вызов.

Вы также можете использовать в своей реализации чар такие методы:

1. `Enchantment#getMinLevel` - возвращает минимальный уровень чар.
2. `Enchantment#getMaxLevel` - возвращает максимальный уровень чар.
3. `Enchantment#getMinEnchantability(Integer)` - минимальный уровень зачаровываемости, рассчитывается по формуле: `1 + level * 10`.
4. `Enchantment#getMaxEnchantability(Integer)` - максимальный уровень зачаровываемости, рассчитывается по формуле: `Enchantment#getMinEnchantability(Integer) + 5`.
5. `Enchantment#calcModifierDamage(Integer, DamageSource)` - расчёт модификатора урона по уровню и `DamageSource`.
6. `Enchantment#func_152376_a(Integer, EnumCreatureAttribute)` - расчёт дополнительного урона по уровню и `EnumCreatureAttribute`.
7. `Enchantment#canApplyTogether(Enchantment)` - возможность совмещать текущие чары с другими.
8. `Enchantment#setName(String)` - задаёт имя чар с шаблоном `enchantment.*name*`.
9. `Enchantment#canApply(ItemStack)` - возможность накладывать чары на предмет.
10. `Enchantment#func_151368_a(EntityLivingBase, Entity, int)` - дополнительная обработка при атаке сущности. Метод принимает аргументы: `атакующий`, `его цель` и `уровень чар`.
11. `Enchantment#func_151367_b(EntityLivingBase, Entity, int)` - дополнительная обработка для защиты при нападении. Метод принимает аргументы: `атакующий`, `его цель` и `уровень чар`.
12. `Enchantment#canApplyAtEnchantingTable(ItemStack)` - возможность получения чар через стол зачарования.
13. `Enchantment#isAllowedOnBooks` - возможность накладывать текущие чары на книгу через стол зачарования.

!!! tip "Подсказка"
    Если положить обычную книгу в стол зачарования, то можно получить книгу с чарами.

Приступим к регистрации!

```java title="ModEnchantments.java"
package ru.mcmodding.tutorial.common.handler;

import net.minecraft.enchantment.Enchantment;
import ru.mcmodding.tutorial.common.enchantment.PoisonBladeEnchantment;

public class ModEnchantments {
    public static Enchantment poisonBlade;

    public static void register() {
        poisonBlade = new PoisonBladeEnchantment();
    }
}
```

И вызовем метод `ModEnchantments#register` в `CommonProxy#preInit`:

```java hl_lines="11"
package ru.mcmodding.tutorial.common;

import cpw.mods.fml.common.event.FMLPreInitializationEvent;
import ru.mcmodding.tutorial.common.handler.*;

public class CommonProxy {

    public void preInit(FMLPreInitializationEvent event) {
        // ...
        
        ModEnchantments.register();
    }
}
```

Зайдём в игру и проверим то, что у нас получилось.

![Книга с чарами](images/enchant/poison_blade_book.png)

![Зачаривание в наковальне](images/enchant/poison_blade_in_anvil.png)

![Зачаривание предмета в столе зачарований](images/enchant/poison_blade_in_ench_table.png)

## Таблица чар

| Идентификатор | Название             | Описание                                      | Макс. уровень |
|---------------|----------------------|-----------------------------------------------|---------------|
| 0             | protection           | Защита                                        | 4             |
| 1             | fireProtection       | Защита от огня                                | 4             |
| 2             | featherFalling       | Защита от падения                             | 4             |
| 3             | blastProtection      | Защита от взрывов                             | 4             |
| 4             | projectileProtection | Защита от снарядов                            | 4             |
| 5             | respiration          | Подводное дыхание                             | 3             |
| 6             | aquaAffinity         | Подводник (Родство с водой)                   | 1             |
| 7             | thorns               | Шипы                                          | 3             |
| 16            | sharpness            | Острота                                       | 5             |
| 17            | smite                | Небесная кара                                 | 5             |
| 18            | baneOfArthropods     | Бич членистоногих (Гибель насекомых)          | 5             |
| 19            | knockback            | Отдача (Отбрасывание)                         | 2             |
| 20            | fireAspect           | Заговор огня                                  | 2             |
| 21            | looting              | Добыча                                        | 3             |
| 32            | efficiency           | Эффективность                                 | 5             |
| 33            | silkTouch            | Шёлковое касание                              | 1             |
| 34            | unbreaking           | Прочность                                     | 3             |
| 35            | fortune              | Удача                                         | 3             |
| 48            | power                | Сила                                          | 5             |
| 49            | punch                | Отбрасывание стрелами                         | 2             |
| 50            | flame                | Горящая стрела                                | 1             |
| 51            | infinity             | Бесконечность                                 | 1             |
| 61            | field_151370_z       | Морская удача (Увеличенный бонус при рыбалке) | 3             |
| 62            | field_151369_A       | Приманка                                      | 3             |

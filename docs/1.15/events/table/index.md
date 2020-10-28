description: Таблица всех событий доступных в Forge API.

# Таблица всех доступных событий

## Клиент
| Событие                                     | Описание                                                                                                      | Возможность отмены |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------|------------------|
| ClientChatEvent                             | Срабатывает клиент отправляет сообщение в чате или команду на сервер.                                         | Да                 |
| ClientChatReceivedEvent                     | Срабатывает когда сообщение отображается на клиенте.                                                          | Нет                |
| ClientPlayerNetworkEvent.LoggedInEvent       | Срабатывает на клиенте когда игрок подключается к серверу.                                                    | Нет
| ClientPlayerNetworkEvent.LoggedOutEvent      | Срабатывает на клиенте когда игрок отключается от сервера.                                                    | Нет
| ClientPlayerNetworkEvent.RespawnEvent        | Срабатывает на клиенте когда игрок перерождается или меняет измерение.                                        | Нет
| ColorHandlerEvent.Block                      | Используется для регистрации цветных блоков(color handlers).                                                  | Нет  
| ColorHandlerEvent.Item                       | Используется для регистрации цветных предметов(color handlers).                                               | Нет  
| DrawBlockHighlightEvent                      | Срабатывает когда блок выделяется при наведении мыши.                                                         | Да                 
| EntityViewRenderEvent.FogDensity             | Событие позволяющие настроить плотность тумана, которую будет видеть игрок.                                   | Да                 
| EntityViewRenderEvent.RenderFogEvent         | Событие позволяющие изменить рендер тумана.                                                                   | Нет                
| EntityViewRenderEvent.FogColors              | Событие позволяющие настроить цвет тумана, который будет видеть игрок.                                        | Нет                
| EntityViewRenderEvent.CameraSetup            | Событие позволяющие изменять углы поворота камеры. Будет полезно для вращения.                                | Нет                
| EntityViewRenderEvent.FOVModifier            | Событие позволяющие изменять угол обзора(FOV) игрока. Будет полезно для создания прицела.                     | Нет                
| FOVUpdateEvent                               | Срабатывает когда вызывается FOV множитель.                                                                   | Нет 
| GuiContainerEvent.DrawForeground             | Срабатывает после того, как GuiContainer отрисовал эллементы переднего плана, но до стака в мышке и тултипов. | Нет  
| GuiContainerEvent.DrawBackground             | Срабатывает после того, как GuiContainer отрисовал эллементы заднего плана.                                   | Нет  
| GuiOpenEvent                                 | Срабатывает когда GUI открывается.                                                                            | Да                 
| GuiScreenEvent.InitGuiEvent.Pre              | Срабатывает после инициализации GuiScreen#MC, GuiScreen#FontRenderer.                                         | Да                 |
| GuiScreenEvent.InitGuiEvent.Post             | Срабатывает после инициализации самого initGui().                                                             | Нет                |
| GuiScreenEvent.DrawScreenEvent.Pre           | Срабатывает до инициализации drawScreen().                                                                    | Да                 |
| GuiScreenEvent.DrawScreenEvent.Post          | Срабатывает после инициализации drawScreen().                                                                 | Нет                |
| GuiScreenEvent.BackgroundDrawnEvent          | Срабатывает в конце drawDefaultBackground(), что позволяет отрисовать текстуру на фоне, но под подсказками.   | Нет                |
| GuiScreenEvent.PotionShiftEvent              | Срабатывает когда зелье активно и требуется смещение GuiInventory.                                            | Да                 |
| GuiScreenEvent.ActionPerformedEvent.Pre      | Срабатывает до нажатия на GuiButton.                                                                          | Да                 |
| GuiScreenEvent.ActionPerformedEvent.Post     | Срабатывает после нажатия на GuiButton.                                                                       | Нет                |
| GuiScreenEvent.MouseClickedEvent.Pre         | Срабатывает после нажатия кнопки мышки, но перед обработкой клика GuiScreen'ом                                | Да                 |
| GuiScreenEvent.MouseClickedEvent.Post        | Срабатывает после IGuiEventListener#mouseClicked(double, double, int).                                        | Да   
| GuiScreenEvent.MouseReleasedEvent.Pre        | Срабатывает после отжатия кнопки мыши, но перед обработкой клика GuiScreen'ом                                 | Да                 | 
| GuiScreenEvent.MouseReleasedEvent.Post       | Срабатывает после IGuiEventListener#mouseReleased(double, double, int).                                       | Да              |
| GuiScreenEvent.MouseDragEvent.Pre            | Срабатывает перед IGuiEventListener#mouseDragged(double, double, int, double, double)                         | Да                 | 
| GuiScreenEvent.MouseDragEvent.Post           | Срабатывает после IGuiEventListener#mouseDragged(double, double, int, double, double).                        | Да              |
| GuiScreenEvent.MouseScrollEvent.Pre          | Срабатывает при повороте колесика мыши и перед IGuiEventListener#mouseScrolled(double).                       | Да                 | 
| GuiScreenEvent.MouseScrollEvent.Post         | Срабатывает при повороте колесика мыши и после IGuiEventListener#mouseScrolled(double).                       | Да              |
| GuiScreenEvent.KeyboardKeyPressedEvent.Pre   | Срабатывает когда ввод с клавиатуры определяется GuiScreen'ом, но до IGuiEventListener#keyPressed(int, int, int).                                                 | Да                 |
| GuiScreenEvent.KeyboardKeyPressedEvent.Post  | Срабатывает когда ввод с клавиатуры определяется GuiScreen'ом, и после IGuiEventListener#keyPressed(int, int, int).             | Да                 |
| GuiScreenEvent.KeyboardKeyReleasedEvent.Pre  | Срабатывает когда ввод с клавиатуры определяется GuiScreen'ом, но до IGuiEventListener#keyReleased(int, int, int).    | Да                 |
| GuiScreenEvent.KeyboardKeyReleasedEvent.Post | Срабатывает когда ввод с клавиатуры определяется GuiScreen'ом, и после IGuiEventListener#keyReleased(int, int, int).  | Да                 |
| GuiScreenEvent.KeyboardCharTypedEvent.Pre    | Срабатывает при нажатии символа на клавиатуре, но перед IGuiEventListener#charTyped(char, int).               | Да              |
| GuiScreenEvent.KeyboardCharTypedEvent.Post   | Срабатывает при нажатии символа на клавиатуре, и после IGuiEventListener#charTyped(char, int).                | Да              |
| InputEvent.RawMouseEvent/ClickInputEvent     | Срабатывает до любой обработки нажатия клавиши/кнопки.                                                        | Да              |
| InputEvent.MouseInputEvent                   | Срабатывает до любой обработки нажатия кнопки мыши.                                                           | Да              |
| InputEvent.MouseScrollEvent                  | Срабатывает при скролле мыши за пределами гуи.                                                                | Да              |
| InputEvent.KeyInputEvent                     | Срабатывает при нажатии кнопки на клавиатуре.                                                                 | Да              |
| InputUpdateEvent                             | Срабатывает перед обновлением  ввода для управления игрока.                                                   | Да              |
| ModelBakeEvent                               | Срабатывает когда ModelManager уведомляет ResourceManager об обновлении/перезагрузке.                         | Нет                |
| ModelRegistryEvent                           | Срабатывает когда ModelLoader готов к регистрации моделей.                                                    | Нет                |
| ParticleFactoryRegisterEvent                 | Срабатывает когда нужно регестрировать ParticleFactory.                                                       | Нет                |
| RecipesUpdatedEvent                          | Срабатывает при синхронизации рецептом между сервером и клиентом.                                             | Нет                |
| RenderBlockOverlayEvent                      | Срабатывает когда текстура блока будет наложена на игрока в HUD.                                              | Да                 |
| RenderGameOverlayEvent.Pre                   | Срабатывает когда GuiIngame будет отрисовано.                                                                 | Да                 |
| RenderGameOverlayEvent.Post                  | Срабатывает после отрисовки GuiIngame.                                                                        | Нет                |
| RenderGameOverlayEvent.BossInfo              | Срабатывает когда информация о боссе будет отрисована в GuiIngame.                                            | Да                 |
| RenderGameOverlayEvent.Text                  | Срабатывает когда текст будет отрисован в GuiIngame.                                                          | Да                 |
| RenderGameOverlayEvent.Chat                  | Срабатывает когда чат будет отрисован в GuiIngame.                                                            | Да                 |
| RenderHandEvent                              | Срабатывает когда до рендера рук. При отмене руки не отрисовываются!                                          | Да                 |
| RenderItemInFrameEvent                       | Срабатывает когда предмет рендериться в рамке для предмета.                                                   | Да                 |
| RenderLivingEvent.Pre, RLE.Specials.Pre      | Срабатывает когда модель сущности рендериться.                                                                | Да                 |  
| RenderLivingEvent.Post, RLE.Specials.Post    | Срабатывает когда модель сущности зарендерилась.                                                              | Нет                |
| RenderPlayerEvent.Pre, RPE.Specials.Pre      | Срабатывает когда модель игрока рендериться.                                                                  | Да                 |
| RenderPlayerEvent.Post, RPE.Specials.Post    | Срабатывает когда модель игрока зарендерилась.                                                                | Нет                |
| RenderPlayerEvent.SetArmorModel              | Срабатывает когда игрок надевает броню.                                                                       | Нет                |
| RenderSpecificHandEvent                      | Срабатывает когда рендериться рука от первого лица.                                                           | Да                 |
| RenderTooltipEvent.Pre                       | Срабатывает до отрисовки подсказки.                                                                           | Да                 |
| RenderTooltipEvent.Post                      | Срабатывает после отрисовки подсказки.                                                                        | Нет                |
| RenderTooltipEvent.PostBackground            | Срабатывает после фона подсказки, но до текста.                                                               | Нет                | 
| RenderTooltipEvent.PostText                  | Срабатывает после отрисовки текста, но перед GL States сбрасывается.                                          | Нет                | 
| RenderWorldLastEvent                         | Срабатывает до того, как мир будет отрисован.                                                                 | Нет                |
| ScreenshotEvent                              | Срабатывает до и после того, как был получен скриншот.                                                        | Да                 |
| TextureStitchEvent.Pre                       | Срабатывает когда TextureMap начинает обновление текстур.                                                     | Нет                |
| TextureStitchEvent.Post                      | Срабатывает когда TextureMap завершает обновление текстур.                                                    | Нет                | 

## Звуки
| Событие                  | Описание                                                     | Возможность отмены |
|--------------------------|--------------------------------------------------------------|--------------------|
| PlaySoundEvent           | Срабатывает когда SoundManager проигрывает звуки.            | Нет                |
| PlaySoundSourceEvent     | Срабатывает когда вызывается метод playSound().              | Нет                |
| PlayStreamingSourceEvent | Срабатывает когда вызывается метод playSound().              | Нет                |
| SoundLoadEvent           | Срабатывает когда SoundManager загружает звуки.              | Нет                |
| SoundSetupEvent          | Срабатывает когда SoundManager производит установку кодеков. | Нет                |

## Чанк менеджер
| Событие           | Описание                                                         | Возможность отмены |
|-------------------|------------------------------------------------------------------|--------------------|
| ForceChunkEvent   | Срабатывает когда чанк собирается продолжать загрузку без игрока | Нет                |
| UnforceChunkEvent | Срабатывает когда чанк не собирается продолжать загрузку         | Нет                |

## Остальные события
| Событие                 | Описание                                                                                 | Возможность отмены |
|-------------------------|------------------------------------------------------------------------------------------|--------------------|
| AnvilUpdateEvent        | Срабатывает когда игрок кладёт предметы в правый и левый слот наковальни.                | Да                 |
| AttachCapabilitiesEvent | Срабатывает когда объект (Entity, Player, TileEntity, World) с поддержкой CAP создаётся. | Нет                |
| CommandEvent            | Срабатывает когда команда была выполнена.                                                | Да                 |
| DifficultyChangeEvent   | Срабатывает когда сложность игры изменяется.                                             | Нет                |
| LootTableLoadEvent      | Срабатывает когда данные LootTable загружаются из Json файла.                            | Да                 |
| ServerChatEvent         | Срабатывает когда C01PacketChatMessage обрабатывается.                                   | Да                 |

## Зельеварение
| Событие                 | Описание                                                                                                    | Возможность отмены |
|-------------------------|-------------------------------------------------------------------------------------------------------------|--------------------|
| PlayerBrewedPotionEvent | Срабатывает когда игрок достаёт зелье из варочной стойки.                                                   | Нет                |
| PotionBrewEvent         | Срабатывает когда варочная стойка начинает и заканчивает варку зелий. Используется подкатегория Pre и Post. | Нет                |

## Зачаровывание
| Событие                  | Описание                                                                                                     | Возможность отмены |
|--------------------------|--------------------------------------------------------------------------------------------------------------|--------------------|
| EnchantmentLevelSetEvent | Срабатывает когда уровень зачарования устанавливается для каждого из трёх возможных чар в столе зачарования. | Да                 |

## Сущности
| Событие                        | Описание                                                    | Возможность отмены |
|--------------------------------|-------------------------------------------------------------|--------------------|
| EntityEvent.EntityConstructing | Срабатывает когда сущность создаётся.                       | Нет                |
| EntityEvent.CanUpdate          | Срабатывает когда сущность обновляется/изменяется.          | Нет                |
| EntityEvent.EnteringChunk      | Срабатывает когда сущность попадает в чанк.                 | Нет                |
| EntityJoinWorldEvent           | Срабатывает когда сущность заходит в мир.                   | Да                 |
| EntityMountEvent               | Срабатывает когда сущностью управляют.                      | Да                 |
| EntityStruckByLightningEvent   | Срабатывает когда молния попадает по сущности.              | Да                 |
| EntityTravelToDimensionEvent   | Срабатывает когда сущность перемещается в другое измерение. | Да                 |
| PlaySoundAtEntityEvent         | Срабатывает когда звуки проигрываются сами существом.       | Да                 |
| ThrowableImpactEvent           | Срабатывает до EntityThrowable, вызывая метод onImpact().   | Да                 |

## Предмет (Как сущность)
| Событие         | Описание                                                                                     | Возможность отмены |
|-----------------|----------------------------------------------------------------------------------------------|--------------------|
| ItemExpireEvent | Срабатывает когда время жизни предмета достигает максимум. (Потом предмет удаляется с земли) | Да                 |
| ItemTossEvent   | Срабатывает когда игрок выбрасывает или перемещает предмет.                                  | Да                 |

## Живые сущности
| Событие                         | Описание                                                                                                                   | Возможность отмены |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------|--------------------|
| AnimalTameEvent                 | Срабатывает когда животное приручается.                                                                                    | Да                 |
| BabyEntitySpawnEvent            | Срабатывает когда сущность спавнит ребёнка.                                                                                | Да                 |
| EnderTeleportEvent              | Срабатывает когда эндермен/шалкер телепортируются или используется жемчуг эндера.                                          | Да                 |
| LivingAttackEvent               | Срабатывает когда сущность атакуют.                                                                                        | Да                 |
| LivingDeathEvent                | Срабатывает когда сущность умирает.                                                                                        | Да                 |
| LivingDestroyBlockEvent         | Срабатывает когда сущность уничтожает блок.                                                                                | Да                 |
| LivingDropsEvent                | Срабатывает когда сущность выбрасывает вещи при смерти.                                                                    | Да                 |
| LivingEntityUseItemEvent.Start  | Срабатывает когда сущность начинает использовать предмет.                                                                  | Да                 |
| LivingEntityUseItemEvent.Tick   | Срабатывает каждый тик, когда сущность использует предмет.                                                                 | Да                 |
| LivingEntityUseItemEvent.Stop   | Срабатывает когда сущность прекращает использовать предмет.                                                                | Да                 |
| LivingEntityUseItemEvent.Finish | Срабатывает когда сущность закончила использовать предмет.                                                                 | Нет                |
| LivingEquipmentChangeEvent      | Срабатывает когда изменяется экипировка сущности.                                                                          | Нет                |
| LivingUpdateEvent               | Срабатывает когда сущность обновляется.                                                                                    | Да                 |
| LivingJumpEvent                 | Срабатывает когда сущность прыгает.                                                                                        | Нет                |
| LivingExperienceDropEvent       | Срабатывает когда сущность сбрасывает опыт.                                                                                | Да                 |
| LivingFallEvent                 | Срабатывает когда сущность падает.                                                                                         | Да                 |
| LivingHealEvent                 | Срабатывает когда сущность исцеляется/восполняет здоровье.                                                                 | Да                 |
| LivingHurtEvent                 | Срабатывает когда сущность получает урон.                                                                                  | Да                 |
| LivingPackSizeEvent             | Срабатывает когда система спавна существ определяет максимальное число сущностей, которые могут заспавниться в тоже время. | Нет                |
| LivingSetAttackTargetEvent      | Срабатывает когда сущность выбирает сущность для атаки.                                                                    | Нет                |
| LivingSpawnEvent.CheckSpawn     | Срабатывает до спавна сущностей                                                                                            | Нет                |
| LivingSpawnEvent.SpecialSpawn   | Срабатывает когда сущность заспавнилась.                                                                                   | Да                 |
| LivingSpawnEvent.AllowDespawn   | Срабатывает каждый тик для деспавна сущности.                                                                              | Нет                |
| LootingLevelEvent               | Позволяет изменить уровень лута при убийстве сущности.                                                                     | Нет                |
| PotionColorCalculationEvent     | Срабатывает после расчёта цвета зелья.                                                                                     | Нет                |
| ZombieEvent.SummonAidEvent      | Срабатывает когда сущность "Зомби" вызывается.                                                                             | Нет                |

## Вагонетка
| Событие                | Описание                                                        | Возможность отмены |
|------------------------|-----------------------------------------------------------------|--------------------|
| MinecartCollisionEvent | Срабатывает когда вагонетка сталкивается с каким либо объектом. | Нет                |
| MinecartInteractEvent  | Срабатывает когда игрок взаимодействует с вагонеткой.           | Да                 |
| MinecartUpdateEvent    | Срабатывает когда вагонетка меняет свою позицию.                | Нет                |

## Игрок
| Событие                                    | Описание                                                                              | Возможность отмены |
|--------------------------------------------|---------------------------------------------------------------------------------------|--------------------|
| AnvilRepairEvent                           | Срабатывает когда игрок забирает отремонтированный предмет.                           | Нет                |
| ArrowLooseEvent                            | Срабатывает когда игрок перестаёт использовать лук. (Стреляет)                        | Да                 |
| ArrowNockEvent                             | Срабатывает когда игрок начинает использовать лук.                                    | Нет                |
| AttackEntityEvent                          | Срабатывает когда игрок атакует сущность.                                             | Да                 |
| BonemealEvent                              | Срабатывает когда игрок использует костную муку на блоке.                             | Да                 |
| EntityItemPickupEvent                      | Срабатывает когда игрок поднимает предметы с земли.                                   | Да                 |
| FillBucketEvent                            | Срабатывает когда игрок заполняет ведро жидкостью.                                    | Да                 |
| ItemFishedEvent                            | Срабатывает когда игрок поймал рыбу.                                                  | Да                 |
| ItemTooltipEvent                           | Срабатывает при проверки дополнительной информации в подсказе. (F3+H)                 | Нет                |
| PlayerContainerEvent.Open                  | Срабатывает когда игрок открывает контейнер. (GUI со слотами)                         | Нет                |
| PlayerContainerEvent.Close                 | Срабатывает когда игрок закрывает контейнер.                                          | Нет                |
| PlayerDestroyItemEvent                     | Срабатывает когда предмет в руке игрока ломается.                                     | Нет                |
| PlayerDropsEvent                           | Срабатывает когда игрок теряет вещи при смерти.                                       | Да                 |
| PlayerEvent.HarvestCheck                   | Срабатывает когда игрок собирает урожай.                                              | Нет                |
| PlayerEvent.BreakSpeed                     | Срабатывает для определения скорости ломания блоков игроком.                          | Да                 |
| PlayerEvent.NameFormat                     | Срабатывает для определения отображаемого ника игрока.                                | Нет                |
| PlayerEvent.Clone                          | Срабатывает когда игрок клонируется. (Умер, перешёл в другое измерение)               | Нет                |
| PlayerEvent.StartTracking                  | Срабатывает когда сущность начинает следить за игроком.                               | Нет                |
| PlayerEvent.StopTracking                   | Срабатывает когда сущность перестаёт следить за игроком.                              | Нет                |
| PlayerEvent.LoadFromFile                   | Срабатывает когда игрок загружается из мирового хранилища.                            | Нет                |
| PlayerEvent.SaveToFile                     | Срабатывает когда игрок сохраняется в мировом хранилище.                              | Нет                |
| PlayerEvent.Visibility                     | Срабатывает при проверки расстояния на котором можно атаковать игрока.                | Нет                |
| PlayerFlyableFallEvent                     | Срабатывает когда игрок падает будучи в полёте.                                       | Нет                |
| PlayerInteractEvent.EntityInteractSpecific | Срабатывает каждый раз, когда игрок взаимодействует с сущностью.                      | Да                 |
| PlayerInteractEvent.EntityInteract         | Срабатывает когда игрок взаимодействует с сущностью.                                  | Да                 |
| PlayerInteractEvent.RightClickBlock        | Срабатывает когда игрок нажимает правой кнопкой мыши по блоку.                        | Да                 |
| PlayerInteractEvent.RightClickItem         | Срабатывает когда игрок нажимает правой кнопкой мыши держа предмет.                   | Да                 |
| PlayerInteractEvent.RightClickEmpty        | Срабатывает когда игрок нажимает правой кнопкой мыши по пустой области, пустой рукой. | Нет                |
| PlayerInteractEvent.LeftClickBlock         | Срабатывает когда игрок нажимает левой кнопкой мыши по блоку.                         | Да                 |
| PlayerInteractEvent.LeftClickEmpty         | Срабатывает когда игрок нажимает левой кнопкой мыши по пустой области, пустой рукой.  | Нет                |
| PlayerPickupXpEvent                        | Срабатывает когда игрок поднимает опыт с земли.                                       | Да                 |
| PlayerSetSpawnEvent                        | Срабатывает когда игрок устанавливает точку спавна.                                   | Да                 |
| PlayerSleepInBedEvent                      | Срабатывает когда игрок спит на кровати.                                              | Нет                |
| PlayerWakeUpEvent                          | Срабатывает когда игрок просыпается.                                                  | Нет                |
| SleepingLocationCheckEvent                 | Срабатывает когда игра проверяет, если игрок спит, то значит он до сих пор в кровати. | Нет                |
| UseHoeEvent                                | Срабатывает когда игрок использует мотыгу на блоке.                                   | Да                 |

## Генерация ландшафта
| Событие                                | Описание                                                                    | Возможность отмены |
|----------------------------------------|-----------------------------------------------------------------------------|--------------------|
| BiomeEvent.CreateDecorator             | Срабатывает когда BiomeDecorator создан.                                    | Нет                |
| BiomeEvent.BiomeColor                  | Срабатывает когда цвет биома меняется.                                      | Нет                |
| BiomeEvent.GetVillageBlockID           | Срабатывает когда генератор деревни пытается получить блок на основе биома. | Нет                |
| BiomeEvent.GetGrassColor               | Срабатывает когда биом запрашивается по цвету травы.                        | Нет                |
| BiomeEvent.GetFoliageColor             | Срабатывает когда биом запрашивается по цвету листвы.                       | Нет                |
| BiomeEvent.GetWaterColor               | Срабатывает когда биом запрашивается по цвету воды.                         | Нет                |
| ChunkGeneratorEvent.ReplaceBiomeBlocks | Срабатывает когда изменяются блоки в зависимости от биома.                  | Нет                |
| ChunkGeneratorEvent.InitNoiseField     | Срабатывает до загрузки шумом в чанк местности.                             | Нет                |
| DecorateBiomeEvent.Pre                 | Срабатывает до того как чанк будет украшен под характеристику биома.        | Нет                |
| DecorateBiomeEvent.Post                | Срабатывает после того как чанк был украшен под характеристику биома.       | Нет                |
| DecorateBiomeEvent.Decorate            | Срабатывает когда чанк был украшен под характеристику биома.                | Нет                |
| InitMapGenEvent                        | Срабатывает при инициализации генератора мира.                              | Нет                |
| InitNoiseGensEvent                     | Срабатывает при инициализации генератора шумов.                             | Нет                |
| OreGenEvent.Pre                        | Срабатывает до того как руда сгенерируется в блоке.                         | Нет                |
| OreGenEvent.Post                       | Срабатывает после того как руда сгенерируется в блоке.                      | Нет                |
| OreGenEvent.GenerateMinable            | Срабатывает когда руда сгенерировалась в блоке.                             | Нет                |
| PopulateChunkEvent.Pre                 | Срабатывает до того как заполнится характеристика местности.                | Нет                |
| PopulateChunkEvent.Post                | Срабатывает после того как заполнится характеристика местности.             | Нет                |
| PopulateChunkEvent.Populate            | Срабатывает когда заполняется характеристика местности.                     | Нет                |
| SaplingGrowTreeEvent                   | Срабатывает когда саженец вырастает в дерево.                               | Нет                |
| WorldTypeEvent.BiomeSize               | Срабатывает при попытке создания биомов.                                    | Нет                |
| WorldTypeEvent.InitBiomeGens           | Срабатывает при попытке запуска генератора биомов.                          | Нет                |

## Мир
| Событие                           | Описание                                                                                                              | Возможность отмены |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------|
| BlockEvent.HarvestDropsEvent      | Срабатывает когда растение может сбросить урожай.                                                                     | Нет                |
| BlockEvent.BreakEvent             | Срабатывает когда блок был разрушен.                                                                                  | Да                 |
| BlockEvent.PlaceEvent             | Срабатывает когда блок был поставлен.                                                                                 | Да                 |
| BlockEvent.MultiPlaceEvent        | Срабатывает при размещении более одного блока сразу. (Кровать)                                                        | Да                 |
| BlockEvent.NeighborNotifyEvent    | Срабатывает при взаимодействии физики на блок.                                                                        | Да                 |
| BlockEvent.CreateFluidSourceEvent | Срабатывает когда блок может превратиться в жидкость.                                                                 | Нет                |
| BlockEvent.CropGrowEvent          | Срабатывает когда зёрна растут.                                                                                       | Нет                |
| BlockEvent.CropGrowEvent.Pre      | Срабатывает когда возраст роста изменяется.                                                                           | Нет                |
| BlockEvent.CropGrowEvent.Post     | Срабатывает когда зёрна выросли.                                                                                      | Нет                |
| ChunkDataEvent.Load               | Срабатывает когда чанк собирается быть загруженным из NBT                                                             | Нет                |
| ChunkDataEvent.Unload             | Срабатывает когда чанк собирается быть выгруженным и сохранённым в NBT                                                | Нет                |
| ChunkEvent.Load                   | Срабатывает когда чанк загрузился.                                                                                    | Нет                |
| ChunkEvent.Unload                 | Срабатывает когда чанк выгрузился.                                                                                    | Нет                |
| ChunkWatchEvent.Watch             | Срабатывает когда игрок начинает просматривать чанк.                                                                  | Нет                |
| ChunkWatchEvent.UnWatch           | Срабатывает когда игрок перестаёт просматривать чанк.                                                                 | Нет                |
| ExplosionEvent.Start              | Срабатывает до того, как произойдёт взрыв.                                                                            | Да                 |
| ExplosionEvent.Detonate           | Срабатывает после взрыва в списке уязвимых блоков и сущностей.                                                        | Нет                |
| GetCollisionBoxesEvent            | Срабатывает в collidesWithAnyBlock() и возвращает getCollisionBoxes()                                                 | Нет                |
| NoteBlockEvent.Play               | Срабатывает когда нотный блок проигрывает ноты.                                                                       | Да                 |
| NoteBlockEvent.Change             | Срабатывает когда изменяются ноты в нотном блоке.                                                                     | Да                 |
| WorldEvent.Load                   | Срабатывает когда Minecraft загружает мир.                                                                            | Нет                |
| WorldEvent.Unload                 | Срабатывает когда Minecraft выгружает мир.                                                                            | Нет                |
| WorldEvent.Save                   | Срабатывает когда Minecraft сохраняет мир.                                                                            | Нет                |
| WorldEvent.PotentialSpawns        | Срабатывает для WorldServer, чтобы собрать список всех возможных сущностей, которые могут появиться в указанном месте | Да                 |
| WorldEvent.CreateSpawnPosition    | Срабатывает когда создаётся новая точка спавна для мира.                                                              | Да                 |

## Жидкость
| Событие                       | Описание                                                              | Возможность отмены |
|-------------------------------|-----------------------------------------------------------------------|--------------------|
| FluidEvent.FluidMotionEvent   | Срабатывает когда жидкость перенесли. (утекла/была залита в ведро)    | Нет                |
| FluidEvent.FluidFillingEvent  | Срабатывает когда жидкость была налита в IFuildTank.                  | Нет                |
| FluidEvent.FluidDrainingEvent | Срабатывает когда жидкость была вылита/взята из IFuildTank.           | Нет                |
| FluidEvent.FluidSpilledEvent  | Срабатывает когда блок содержащий жидкость ломается и разливает воду. | Нет                |
| FluidRegisterEvent            | Срабатывает когда жидкость регистрируется.                            | Нет                |

## Конфигурация
| Событие                                   | Описание                                                                                                    | Возможность отмены |
|-------------------------------------------|-------------------------------------------------------------------------------------------------------------|--------------------|
| ConfigChangedEvent.OnConfigChangedEvent   | Срабатывает когда кнопка GuiConfig нажата и выполняются условия: "хотя бы один элемент конфига был изменён" | Нет                |
| ConfigChangedEvent.PostConfigChangedEvent | Срабатывает после изменения конфигурации мода.                                                              | Нет                |

## Игровые события
| Событие                                 | Описание                                                 | Возможность отмены |
|-----------------------------------------|----------------------------------------------------------|--------------------|
| InputEvent.MouseInputEvent              | Срабатывает когда нажата кнопка на мыши.                 | Нет                |
| InputEvent.KeyInputEvent                | Срабатывает когда нажата кнопка на клавиатуре.           | Нет                |
| PlayerEvent.ItemPickupEvent             | Срабатывает когда игрок поднимает предмет(-ы).           | Нет                |
| PlayerEvent.ItemCraftedEvent            | Срабатывает когда игрок скрафтил предмет.                | Нет                |
| PlayerEvent.ItemSmeltedEvent            | Срабатывает когда игрок выплавил предмет.                | Нет                |
| PlayerEvent.PlayerLoggedInEvent         | Срабатывает когда новый игрок подключился к серверу.     | Нет                |
| PlayerEvent.PlayerLoggedOutEvent        | Срабатывает когда игрок отключился от сервера.           | Нет                |
| PlayerEvent.PlayerRespawnEvent          | Срабатывает когда игрок возродился после смерти.         | Нет                |
| PlayerEvent.PlayerChangedDimensionEvent | Срабатывает когда игрок переместился в другое измерение. | Нет                |
| TickEvent.ServerTickEvent               | Тики на сервер.                                          | Нет                |
| TickEvent.ClientTickEvent               | Тики на клиенте.                                         | Нет                |
| TickEvent.WorldTickEvent                | Тики в мире.                                             | Нет                |
| TickEvent.PlayerTickEvent               | Тики игрока.                                             | Нет                |
| TickEvent.RenderTickEvent               | Тики рендера.                                            | Нет                |

## Пакетная система
| Событие                                            | Описание                                                           | Возможность отмены |
|----------------------------------------------------|--------------------------------------------------------------------|--------------------|
| FMLNetworkEvent.ClientConnectedToServerEvent       | Срабатывает на клиенте, когда клиенте подключается к серверу.      | Нет                |
| FMLNetworkEvent.ServerConnectionFromClientEvent    | Срабатывает на сервере, когда клиент подключается к серверу.       | Нет                |
| FMLNetworkEvent.ServerDisconnectionFromClientEvent | Срабатывает на сервере, когда клиент отключается от сервера.       | Нет                |
| FMLNetworkEvent.ClientDisconnectionFromServerEvent | Срабатывает на клиенте, когда клиент отключается от сервера.       | Нет                |
| FMLNetworkEvent.CustomPacketRegistrationEvent      | Срабатывает когда зарегистрирован/разрегистрирован пакет в канале. | Нет                |
| FMLNetworkEvent.ClientCustomPacketEvent            | Срабатывает когда клиент получает пользовательский пакет.          | Нет                |
| FMLNetworkEvent.ServerCustomPacketEvent            | Срабатывает когда сервер получает пользовательский пакет.          | Нет                |
| FMLNetworkEvent.CustomNetworkEvent                 | Срабатывает когда пользовательское событие вызывается из канала.   | Нет                |

## Руда
| Событие          | Описание                               | Возможность отмены |
|------------------|----------------------------------------|--------------------|
| OreRegisterEvent | Срабатывает когда руда регистрируется. | Нет                |

import { Injectable } from '@angular/core'
import { DialogService } from '@app/service/dialog'
import { Point } from '@app/type'
import { StatsService } from '@shared/module/poe/service'
import { Item, ItemCategory, Language, StatType } from '@shared/module/poe/type'
import { Observable } from 'rxjs'
import { DialogSpawnPosition } from 'src/app/layout/type'
import {
  EvaluateDialogComponent,
  EvaluateDialogData,
} from '../component/evaluate-dialog/evaluate-dialog.component'
import {
  EvaluateResultView,
  EvaluateUserSettings,
} from '../component/evaluate-settings/evaluate-settings.component'
import { EvaluateResult } from '../type/evaluate.type'

const DIALOG_MIN_WIDTH = 400
const DIALOG_LINE_HEIGHT = 19
const DIALOG_DIVIDER_HEIGHT = 8
const DIALOG_AVG_CHAR_WIDTH = 7.6
const DIALOG_AVG_VALUE_WIDTH = 36

@Injectable({
  providedIn: 'root',
})
export class EvaluateDialogService {
  constructor(private readonly dialog: DialogService, private readonly stats: StatsService) {}

  public open(
    point: Point,
    item: Item,
    settings: EvaluateUserSettings,
    language?: Language
  ): Observable<EvaluateResult> {
    const { width, height } = this.estimateBounds(item, settings, language)

    const data: EvaluateDialogData = {
      item,
      settings,
      language,
    }

    const position = settings.dialogSpawnPosition === DialogSpawnPosition.Cursor ? point : undefined
    return this.dialog.open(
      EvaluateDialogComponent,
      data,
      {
        position,
        width,
        height,
      },
      settings.focusable
    )
  }

  private estimateBounds(
    item: Item,
    settings: EvaluateUserSettings,
    language: Language
  ): { width: number; height: number } {
    let width = 4 // padding
    let height = 4 // padding

    if (item.nameId) {
      height += 20
    }
    if (item.typeId) {
      height += 33
    }

    if (item.damage || item.properties) {
      if (item.damage) {
        if (item.damage.dps) {
          height += DIALOG_LINE_HEIGHT
        }
        if (item.damage.edps) {
          height += DIALOG_LINE_HEIGHT
        }
        if (item.damage.edps) {
          height += DIALOG_LINE_HEIGHT
        }
      }
      if (item.properties) {
        Object.getOwnPropertyNames(item.properties).forEach((key) => {
          if (item.properties[key]) {
            switch (key) {
              case 'ultimatum':
                height += DIALOG_LINE_HEIGHT * 2
                if (item.properties.ultimatum.requiredItem) {
                  height += DIALOG_LINE_HEIGHT
                }
                break
              case 'incursion':
                const incursion = item.properties.incursion
                height +=
                  DIALOG_LINE_HEIGHT * (incursion.openRooms.length + incursion.closedRooms.length)
                if (incursion.openRooms.length > 0 && incursion.closedRooms.length > 0) {
                  height += DIALOG_DIVIDER_HEIGHT
                }
                break
              case 'heist':
                const heist = item.properties.heist
                height += DIALOG_LINE_HEIGHT * heist.requiredSkills.length
                if (heist.objectiveName) {
                  height += DIALOG_LINE_HEIGHT
                }
                if (heist.wingsRevealed) {
                  height += DIALOG_LINE_HEIGHT
                }
                if (heist.escapeRoutes) {
                  height += DIALOG_LINE_HEIGHT
                }
                if (heist.rewardRooms) {
                  height += DIALOG_LINE_HEIGHT
                }
                break
              default:
                height += DIALOG_LINE_HEIGHT
                break
            }
          }
        })
      }
      height += DIALOG_DIVIDER_HEIGHT
    }

    if (item.level || item.requirements) {
      if (item.level) {
        height += DIALOG_LINE_HEIGHT
      }
      if (item.requirements) {
        height += DIALOG_LINE_HEIGHT
      }
      height += DIALOG_DIVIDER_HEIGHT
    }

    if (item.sockets) {
      const length = item.sockets.length
      const socketHeight = Math.floor((length + 1) / 2) * 34
      const linkHeight = length >= 3 ? Math.floor((length - 1) / 2) * 22 : 0
      height += socketHeight + linkHeight
      height += DIALOG_DIVIDER_HEIGHT
    }

    if (item.stats) {
      height += item.stats.reduce((a) => a + DIALOG_LINE_HEIGHT, 0)

      item.stats.forEach((stat) => {
        const parts = this.stats.transform(stat, language)
        const count = parts.reduce((a, b) => a + b.length, 0)
        const size = count * DIALOG_AVG_CHAR_WIDTH + stat.values.length * DIALOG_AVG_VALUE_WIDTH
        if (size >= width) {
          width = size
        }
      })

      const unique = {}
      item.stats.forEach((stat) => (unique[stat.type] = true))
      if (unique[StatType.Enchant]) {
        height += DIALOG_DIVIDER_HEIGHT
      }
      if (unique[StatType.Scourge]) {
        height += DIALOG_DIVIDER_HEIGHT
      }
      if (unique[StatType.Implicit]) {
        height += DIALOG_DIVIDER_HEIGHT
      }
      if (
        unique[StatType.Explicit] ||
        unique[StatType.Crafted] ||
        unique[StatType.Fractured] ||
        unique[StatType.Monster] ||
        unique[StatType.Ultimatum]
      ) {
        height += DIALOG_DIVIDER_HEIGHT
      }
      if (unique[StatType.Pseudo]) {
        height += DIALOG_DIVIDER_HEIGHT
      }
    }

    if (item.veiled || item.corrupted || item.unmodifiable || item.relic) {
      if (item.veiled) {
        height += DIALOG_LINE_HEIGHT
      }
      if (item.corrupted || item.unmodifiable) {
        height += DIALOG_LINE_HEIGHT
      }
      if (item.relic) {
        height += DIALOG_LINE_HEIGHT
      }
      height += DIALOG_DIVIDER_HEIGHT
    }

    if (item.influences) {
      height += DIALOG_LINE_HEIGHT
      height += DIALOG_DIVIDER_HEIGHT
    }

    // price / graph
    height += DIALOG_DIVIDER_HEIGHT

    const value = 45
    height += value
    height += DIALOG_DIVIDER_HEIGHT

    const price = 64
    height += price

    const toggles = 35
    height += toggles

    if (settings.evaluateResultView === EvaluateResultView.Graph) {
      const graph = 200
      height += graph
    } else {
      const list = 424
      height += list
    }

    return {
      width: Math.max(width, DIALOG_MIN_WIDTH),
      height,
    }
  }
}

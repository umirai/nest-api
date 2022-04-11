import { TeamNameVO } from "src/domain/team/team-name-vo"
import { Pair } from "src/domain/team/pair"

export type TeamProps = {
  id: string,
  teamName: TeamNameVO,
  pairs: Pair[]
}

export class Team {
  private _props: TeamProps
  private MIN_MEMBERS_COUNT = 3

  public constructor(props: TeamProps) {
    if (this.isInvalid(props.pairs)) throw new Error('チームには3名以上のメンバーが必要です。')
    this._props = props
  }

  get id() {
    return this._props.id
  }

  get teamName() {
    return this._props.teamName.value
  }

  get pairs() {
    return this._props.pairs
  }

  get userIdList() {
    return this.getUserIdList(this._props.pairs)
  }

  get allProps() {
    const { id, teamName, pairs } = this._props
    return {
      id: id,
      teamName: teamName.value,
      pairs: pairs
    }
  }

  private isInvalid(pairs: Pair[]): boolean {
    return !(this.MIN_MEMBERS_COUNT <= this.getUserIdList(pairs).length)
  }

  private getUserIdList(pairs: Pair[]): string[] {
    let teamUserIdList: string[] = []
    pairs.map((pair) => {
      pair.userIdList.map((userId) => teamUserIdList.push(userId))
    })
    return teamUserIdList
  }

  public getMinimumPair(): Pair {
    return this.pairs.reduce((minPair: Pair, currentPair: Pair): Pair => {
      if (minPair === null) minPair = currentPair
      if (minPair.userIdList.length > currentPair.userIdList.length) minPair = currentPair
      return minPair
    }, null)
  }

  public generateNonDuplicatePairName(): string {
    let nonDuplicatePairName = ''
    const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const pairNames = this.pairs.map((pair) => pair.pairName)
    for (let i = 0; i < alphabets.length; i++) {
      if (!pairNames.includes(alphabets[i])) {
        nonDuplicatePairName = alphabets[i]
        break
      }
    }
    return nonDuplicatePairName
  }

  public getPairByUserId(userId: string): Pair {
    return this.pairs.filter((pair) => pair.userIdList.includes(userId))[0]
  }

  public addPair(pair: Pair): void {
    this.pairs.push(pair)
  }

  public removeUser(userId: string) {
    const pair = this.getPairByUserId(userId)
    const index = this.userIdList.indexOf(userId)
    pair.userIdList.splice(index, 1)

    // テスト用
    const alert = []
    if (this.userIdList.length < this.MIN_MEMBERS_COUNT) {
      alert.push('team')
      // console.log('チーム人数が2名以下になっている旨を管理者通知')
    }
    if (pair.userIdList.length < pair.minMembersCount) {
      alert.push('pair')
      // console.log('ペア人数が1名以下になっている旨を管理者通知')
    }
    return alert
  }
}

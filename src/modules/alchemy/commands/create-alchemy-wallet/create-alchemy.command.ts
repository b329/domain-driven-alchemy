import { Command, CommandProps } from '@libs/ddd';

export class CreateAlchemyCommand extends Command {
  readonly userId: string;

  constructor(props: CommandProps<CreateAlchemyCommand>) {
    super(props);
    this.userId = props.userId;
  }
}
